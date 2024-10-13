"use client";

import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  // ... (previous code remains the same)

  return (
    <>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* ... (HomeCard components remain the same) */}

        {!callDetails ? (
          <MeetingModal
            isOpen={meetingState === "isScheduledMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Create Meeting"
            handleClick={createMeeting}
            className="text-left" // Added className
            buttonText="Create Meeting" // Added buttonText
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">
                Add a description
              </label>
              <Textarea
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  setValues({ ...values, description: e.target.value });
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">
                Select date and Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </MeetingModal>
        ) : (
          <MeetingModal
            isOpen={meetingState === "isScheduledMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({ title: "Link Copied" });
            }}
            image="/icon/checked.svg"
            buttonIcon="/icons/copy.svg"
            buttonText="Copy meeting link"
          />
        )}

        <MeetingModal
          isOpen={meetingState === "isInstantMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start meeting"
          handleClick={createMeeting}
        />
        <MeetingModal
          isOpen={meetingState === "isJoiningMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Type the link here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={() => router.push(values.link)}
        >
          <Input
            placeholder="Meeting link"
            onChange={(e) => setValues({ ...values, link: e.target.value })}
            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </MeetingModal>
      </section>
    </>
  );
};

export default MeetingTypeList;
