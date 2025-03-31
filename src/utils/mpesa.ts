
// M-Pesa API utility functions
import { formatPhoneNumber } from "./phone";

// Real M-Pesa credentials
const MPESA_CONSUMER_KEY = "2QBGZWGQOjGOs5OdvQT0PJ1TMVPuGsKo";
const MPESA_CONSUMER_SECRET = "UH4Gt61wa1Glai6H";
const MPESA_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const MPESA_SHORTCODE = "174379";

export const getAccessToken = async () => {
  try {
    const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
    
    // Use a PHP proxy to avoid CORS issues
    const response = await fetch("./api/mpesa-auth.php", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`
      }
    });
    
    const data = await response.json();
    console.log("Access token response:", data);
    
    if (data.error) {
      throw new Error(data.error_description || "Authentication failed");
    }
    
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Could not authenticate with M-Pesa");
  }
};

export const initiateSTKPush = async (phone: string, amount: number, eventTitle: string, ticketQuantity: number) => {
  try {
    const accessToken = await getAccessToken();
    const formattedPhone = formatPhoneNumber(phone);
    
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
    
    // Use PHP proxy to avoid CORS issues
    const response = await fetch("./api/mpesa-stkpush.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessToken,
        phoneNumber: formattedPhone,
        amount: amount.toString(),
        accountReference: `Event-${eventTitle.substring(0, 10)}`,
        transactionDesc: `Payment for ${ticketQuantity} ticket(s) for ${eventTitle}`,
        timestamp,
        password
      })
    });
    
    const data = await response.json();
    console.log("STK Push response:", data);
    
    if (data.ResponseCode === "0") {
      // Save booking details to database
      const bookingResponse = await fetch("./api/create-booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event: eventTitle,
          customer: "Customer", // In a real app, get from user profile
          email: "customer@example.com", // In a real app, get from user profile
          phone: formattedPhone,
          date: new Date().toISOString().split('T')[0],
          tickets: ticketQuantity,
          total: amount.toString(),
          status: "pending"
        })
      });
      
      const bookingData = await bookingResponse.json();
      console.log("Booking created:", bookingData);
      
      return true;
    } else {
      throw new Error(data.ResponseDescription || "M-Pesa request failed");
    }
  } catch (error) {
    console.error("STK Push error:", error);
    throw error;
  }
};
