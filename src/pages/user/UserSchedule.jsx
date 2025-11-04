import React from "react";
import CalendarSchedule from "../../components/user/CalendarSchedule";

const UserSchedule = ({ userId }) => {
  return (
    <div className="max-w-full mx-auto">
      <CalendarSchedule userId={userId} userType="student" isOwner={true} />
    </div>
  );
};

export default UserSchedule;
