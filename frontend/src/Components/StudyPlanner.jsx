import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Alert, Spinner } from "react-bootstrap";
import { SlCalender } from "react-icons/sl";
const StudyPlanner = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const fetchStudyPlan = async () => {
    setLoading(true);
    try {
      // console.log('fecth')
      const res = await fetch("/");
      const response = await res.json();
      if (response.status) {
        setStudyPlan(response.data);
        setError("");
        setLoading(false);
      } else {
        setLoading(false);
        setError(response.message);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setLoading(false);
      setError("Error fetching Plans");
      setTimeout(() => {
        setError("");
      }, [3000]);
    }
  };

  return (
    <div className="w-[80%]">
      <div>
        <div>
          <div className="flex-col flex items-center justify-center">
            <div className=" p-4 w-[100%]">
              <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
                <SlCalender className="text-blue-900 text-2xl ml-4" />
                <h1 className="text-blue-900 text-2xl font-bold ml-2">
                  Planner
                </h1>
              </div>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>
      <div className="m-8">
        {loading ? (
          <Spinner />
        ) : studyPlan ? (
          <div>
            <p>No Study Plan Yet</p>
            <button>Generate</button>
          </div>
        ) : (
          <div></div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  );
};

export default StudyPlanner;
