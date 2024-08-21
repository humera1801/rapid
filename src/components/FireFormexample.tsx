"use client";
import React from "react";
import { useForm } from "react-hook-form";

export default function TicketBook() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {

    const formData = new FormData();
    for (const file of data.parcel_imgs) {
      formData.append("parcel_imgs", file);
    }

    console.log(data);
    

    try {
      const response = await fetch(
        "http://192.168.0.100:3001/parcel/test_data",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === "1") {
        alert("Added successfully");
      } else {
        alert("Failed to add record");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add record");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register("parcel_imgs")} multiple />
      <button type="submit">Upload</button>
    </form>
  );
}
