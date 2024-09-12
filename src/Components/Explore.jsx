import React, { useState } from "react";
import Search from "./Search";
import Filter from "./Filter";
import { useNavigate } from "react-router-dom";

const calculateTimeLeft = (startDate) => {
  const now = new Date();
  const timeDifference = new Date(startDate) - now;

  if (timeDifference <= 0) return { days: 0, hours: 0, minutes: 0 };

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

  return { days, hours, minutes };
};

const Explore = () => {
  const navigate = useNavigate();
  const challengeData = localStorage.getItem("challenge");

  const [challenges, setChallenges] = useState(JSON.parse(challengeData || []));
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all", level: "all" });

  // search
  const handleSearch = (e) => setSearchTerm(e);

  // filter
  const handleFilterChange = (status, level) => {
    setFilters({ status, level });
  };

  // Filter and search logic
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesStatus =
      filters.status === "all" || challenge.status === filters.status;
    const matchesSearch = challenge.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  //
  const handleParticipate = (id, e) => {
    e.preventDefault();
    navigate(`/view/${id}`);
  };

  return (
    <div>
      <section className="explore-sec-1">
        <div>
          <h2 className="heading-2">Explore Challenges</h2>
        </div>
        <div className="flex">
          <Search onSearch={handleSearch} />
          <Filter onFilterChange={handleFilterChange} />
        </div>
      </section>

      <section>
        {filteredChallenges.length > 0 ? (
          <div className="explore-sec-2 ">
            {filteredChallenges.map((challenge) => {
              const { days, hours, minutes } = calculateTimeLeft(
                challenge.startDate
              );

              return (
                <div className="card-box" key={challenge.id}>
                  <div>
                    <img src={challenge.image} alt={challenge.name} />
                  </div>
                  <div className="card">
                    <span>{challenge.status}</span>
                    <h3>{challenge.name}</h3>
                    <span>
                      {challenge.status === "upcoming"
                        ? "Starts in"
                        : challenge.status === "active"
                        ? "Ends in"
                        : "Ended on"}
                    </span>
                    <div className="timer">
                      <p>Days: {days}</p>
                      <p>Hours: {hours}</p>
                      <p>Mins: {minutes}</p>
                    </div>
                    <button
                      className="btn"
                      onClick={(e) => handleParticipate(challenge.id, e)}
                    >
                      Participate Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No challenges found.</p>
        )}
      </section>
    </div>
  );
};

export default Explore;
