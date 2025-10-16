import { createContext, useState, useCallback } from "react";
import { fetchAllMentorCVs, approveMentorCVs, rejectMentorCVs } from "../../services/admin/mentorService";

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
            setMentors(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const approveMentors = useCallback(async (ids) => {
        setLoading(true);
        try {
            await approveMentorCVs(ids);
            await fetchMentors();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [fetchMentors]);

    const rejectMentors = useCallback(async (ids) => {
        setLoading(true);
        try {
            await rejectMentorCVs(ids);
            await fetchMentors();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [fetchMentors]);

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
        <MentorContext.Provider value={value}>
            {children}
        </MentorContext.Provider>
    );
};

export default MentorContext;