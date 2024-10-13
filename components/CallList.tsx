"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/node-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCards from "./MeetingCards";
import { Call } from "@stream-io/video-react-sdk";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";

// Type guard function
function isCallRecording(meeting: Call | CallRecording): meeting is CallRecording {
  return 'start_time' in meeting;
}

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessages = () => {
    switch (type) {
      case "ended":
        return "No previous Calls";
      case "recordings":
        return "No recordings";
      case "upcoming":
        return "No upcoming calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );
        const newRecordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        
        // Convert string dates to Date objects
        const convertedRecordings = newRecordings.map(recording => ({
          ...recording,
          start_time: new Date(recording.start_time),
          end_time: new Date(recording.end_time)
        }));

        setRecordings(convertedRecordings);
      } catch (error) {
        console.log(error);
        toast({ title: "Try again later" });
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessages();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCards
            key={isCallRecording(meeting) ? meeting.url : meeting.id}
            icon={
              type === "ended"
                ? "/icons/upcoming.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              !isCallRecording(meeting) && meeting.state?.custom?.description
                ? meeting.state.custom.description.substring(0, 20)
                : "No Description"
            }
            date={
              isCallRecording(meeting)
                ? meeting.start_time.toLocaleString()
                : meeting.state?.startsAt
                ? meeting.state.startsAt.toLocaleString()
                : "No date available"
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              isCallRecording(meeting)
                ? () => router.push(meeting.url)
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              isCallRecording(meeting)
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;