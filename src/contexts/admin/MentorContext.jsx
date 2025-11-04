import { createContext, useState, useCallback } from "react";
import {
  fetchAllMentorCVs,
  approveMentorCVs,
  rejectMentorCVs,
} from "../../services/admin/mentorService";

const MentorContext = createContext();

export const MentorProvider = ({ children }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMentors = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetchAllMentorCVs(params);
      const data = response.data || {};
      console.log("Fetched Mentors Data:", data);

      // Không lọc theo accountRole nữa, hiển thị tất cả CV được trả về từ API
      const allMentors = data.content || [];
      setMentors(allMentors);
      setTotalPages(data.totalPages || 1);
      setTotalElements(allMentors.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveMentors = useCallback(
    async (ids) => {
      setLoading(true);
      try {
        await approveMentorCVs(ids);
        await fetchMentors();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchMentors]
  );

  const rejectMentors = useCallback(
    async (ids) => {
      setLoading(true);
      try {
        await rejectMentorCVs(ids);
        await fetchMentors();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchMentors]
  );

  const value = {
    mentors,
    loading,
    fetchMentors,
    approveMentors,
    rejectMentors,
    totalPages,
    totalElements,
  };

  return (
    <MentorContext.Provider value={value}>{children}</MentorContext.Provider>
  );
};

export default MentorContext;
