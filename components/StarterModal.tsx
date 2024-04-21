"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import Interests from "./Interests";
import Location from "./Location";
import ReasonForJoining from "./ReasonForJoining";
import CheckDetails from "./CheckDetails";



const StarterModal = ({clerkId}: {clerkId: string | undefined}) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [reasonForJoining, setReasonForJoining] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  

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

  const handleSubmit = async() => {
    console.log({clerkId, interests, location, reasonForJoining});
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  

  return (
    <Modal isOpen={isModalOpen}>
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
    </Modal>
  );
};

export default StarterModal;
