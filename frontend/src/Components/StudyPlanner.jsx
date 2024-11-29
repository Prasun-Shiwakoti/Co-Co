import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Alert, Spinner } from "react-bootstrap";
import { SlCalender } from "react-icons/sl";
const StudyPlanner = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    daysBeforeExam: 0,
    subjects: [],
    priority: [],
  });

  // Initialize state for handling form inputs
  const [daysBeforeExam, setDaysBeforeExam] = useState(7);
  const [subjects, setSubjects] = useState([{ name: "", priority: 50 }]);

  // Function to handle subject changes
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  // Function to add a new subject
  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", priority: 50 }]);
  };

  // Function to remove a subject
  const handleRemoveSubject = (index) => {
    if (subjects.length > 1) {
      const updatedSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(updatedSubjects);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect the data in the format for formData
    const subjectData = subjects.map((subject) => ({
      name: subject.name,
      priority: subject.priority,
    }));

    const data = {
      daysBeforeExam: daysBeforeExam,
      subjects: subjectData,
      priority: subjects.map((subject) => subject.priority),
    };

    // Update the formData state
    setFormData(data);

    // Log the form data (you can send it to backend or process it further)
    console.log("Form Data: ", data);
  };

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
      <div
        className="max-w-xl m-8 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg text-blue-900 max-h-[75vh] overflow-y-auto"
        style={{
          scrollbarWidth: "thin", // For Firefox
          WebkitScrollbar: {
            width: "8px", // For Webkit Browsers (e.g., Chrome)
          },
          WebkitScrollbarThumb: {
            backgroundColor: "#1E3A8A", // blue-900
          },
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Study Planner
        </h2>

        <form onSubmit={handleSubmit} className="">
          {/* Days Before Exam */}
          <div className="mb-4">
            <label
              htmlFor="daysBeforeExam"
              className="block text-sm font-medium mb-2"
            >
              Days Before Exam
            </label>
            <input
              type="number"
              id="daysBeforeExam"
              min="1"
              value={daysBeforeExam}
              onChange={(e) => setDaysBeforeExam(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Subjects */}
          {subjects.map((subject, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={`subject-${index}`}
                  className="block text-sm font-medium"
                >
                  Subject {index + 1}
                </label>
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Subject Name */}
              <input
                type="text"
                id={`subject-${index}`}
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) =>
                  handleSubjectChange(index, "name", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />

              {/* Priority Slider */}
              <label
                htmlFor={`priority-${index}`}
                className="block text-sm font-medium mb-1"
              >
                Priority (1 - 100)
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="range"
                  id={`priority-${index}`}
                  min="1"
                  max="100"
                  value={subject.priority}
                  onChange={(e) =>
                    handleSubjectChange(index, "priority", e.target.value)
                  }
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium">
                  {subject.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          ))}

          {/* Add Another Subject */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddSubject}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Another Subject
            </button>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
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
