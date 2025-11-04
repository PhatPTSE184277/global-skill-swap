import React from "react";
import CalendarSchedule from "../../components/user/CalendarSchedule";

const MentorSchedule = ({ userId, isOwner = false }) => {
  return (
    <div className="max-w-full mx-auto">
      <CalendarSchedule userId={userId} userType="mentor" isOwner={isOwner} />
    </div>
  );
};

export default MentorSchedule;
