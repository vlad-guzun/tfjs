"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Interests from "./Interests";
import Location from "./Location";
import ReasonForJoining from "./ReasonForJoining";
import CheckDetails from "./CheckDetails";

const StarterModal = ({ clerkId,setModalSubmitted }: { clerkId: string | undefined, setModalSubmitted: (value: boolean) => void }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [reasonForJoining, setReasonForJoining] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [shouldRenderStarterModal, setShouldRenderStarterModal] = useState<boolean>(true);
  const [formSubmitted, setFormSubmitted] = useState(false); 

  useEffect(() => {
    async function checkRenderModal() {
      const response = await fetch(`/api/check_render_modal?clerkId=${clerkId}`);
      if(!response.ok) {setShouldRenderStarterModal(true);} // aici cred ca treb sa ii dau cumva un refresh automat, dar nush vedem
      else {
      const data = await response.json();
      if(data.message === "don't render the starter modal") setShouldRenderStarterModal(false);
      }
    } 
    checkRenderModal();
  }, [clerkId]);

  useEffect(() => {
    if (formSubmitted) {
      const modalSubmitted = async () => {
         await fetch(`/api/completed_submitting_modal?clerkId=${clerkId}`);
      }
      console.log("modal submitted");
      modalSubmitted();
      setFormSubmitted(false); // asta ii sa nu iti dea fata sens acolo in console , nu mai pasa din viata functie!!!!
    }
  }, [formSubmitted]);

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
    await fetch("/api/send_data_without_embeddings", {
      method: "POST",
      body: JSON.stringify({
        clerkId,
        interests,
        location,
        reasonForJoining,
      }),
    });
    setFormSubmitted(true); 
    setModalSubmitted(true); // aici!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    shouldRenderStarterModal && (
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
    )
  );
};

export default StarterModal;
