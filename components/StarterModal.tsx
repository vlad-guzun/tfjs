"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./Modal";
import Interests from "./Interests";
import Location from "./Location";
import ReasonForJoining from "./ReasonForJoining";
import CheckDetails from "./CheckDetails";

const StarterModal = ({ clerkId, setModalSubmitted }: { clerkId: string | undefined, setModalSubmitted: (value: boolean) => void }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [reasonForJoining, setReasonForJoining] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const modalSubmitted = Cookies.get(`modalSubmitted_${clerkId}`);  
    if (modalSubmitted === "true") {
      setIsModalOpen(false);
    }
  }, [clerkId]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSaveInterests = (data: string) => {
    setInterests(data);
  };

  const handleSaveLocation = (data: string) => {
    setLocation(data);
  };

  const handleSaveReasonForJoining = (data: string) => {
    setReasonForJoining(data);
  };

  const handleSubmit = async () => {
    if (!clerkId) {
      console.log("clerkId is not defined");
      return;
    }
    const queryParams = `clerkId=${encodeURIComponent(clerkId)}&interests=${encodeURIComponent(interests)}&location=${encodeURIComponent(location)}&reasonForJoining=${encodeURIComponent(reasonForJoining)}`;

    const url = `/api/send_data_without_embeddings?${queryParams}`;

    await fetch(url, { method: "GET" });
    setFormSubmitted(true);
    setModalSubmitted(true);
    setIsModalOpen(false);
    Cookies.set(`modalSubmitted_${clerkId}`, "true", { expires: new Date("2027-11-12") }); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen}>
      {!formSubmitted && (
        <>
          {step === 1 && <Interests onNext={handleNext} onSave={handleSaveInterests} />}
          {step === 2 && <Location onNext={handleNext} onPrev={handlePrev} onSave={handleSaveLocation} />}
          {step === 3 && (
            <ReasonForJoining onNext={handleNext} onPrev={handlePrev} onSave={handleSaveReasonForJoining} />
          )}
          {step === 4 && (
            <CheckDetails
              onSubmit={handleSubmit}
              onPrev={handlePrev}
              interests={interests}
              location={location}
              reasonForJoining={reasonForJoining}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default StarterModal;
