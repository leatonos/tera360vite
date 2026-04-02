import type { Tour } from "../types";

const apiUrl = import.meta.env.VITE_API;

export async function saveData(TourData: Tour,TourId: string) {
    
  const itemId = TourId
  const updateData = TourData

  // Get username from localStorage
  const username = localStorage.getItem("username")

  // Add it into the data you send
  const payload = {
    ...updateData,
    user_name: username
  }

  try {
    const response = await fetch(`${apiUrl}/update/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }else{
      const updatedDoc = await response.json()
      console.log("Updated document:", updatedDoc)
      return true
    }

    
  } catch (err) {
    console.error("Update failed:", err)
  }
    
}
