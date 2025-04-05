
// M-Pesa API utility functions
import { formatPhoneNumber } from "./phone";
import { getMpesaSettings } from "./mpesa-settings";

export const getAccessToken = async () => {
  try {
    // Get M-Pesa settings from database
    const settings = await getMpesaSettings();
    
    if (!settings) {
      throw new Error("M-Pesa settings not configured. Please set up your M-Pesa credentials in the admin dashboard.");
    }
    
    const auth = btoa(`${settings.consumer_key}:${settings.consumer_secret}`);
    
    // Use a PHP proxy to avoid CORS issues - use correct relative path
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
    // Get M-Pesa settings from database
    const settings = await getMpesaSettings();
    
    if (!settings) {
      throw new Error("M-Pesa settings not configured. Please set up your M-Pesa credentials in the admin dashboard.");
    }
    
    const accessToken = await getAccessToken();
    const formattedPhone = formatPhoneNumber(phone);
    
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    const password = btoa(`${settings.shortcode}${settings.passkey}${timestamp}`);
    
    // Generate a unique request ID for tracking this transaction
    const requestId = `REQ-${Math.random().toString(36).substring(2, 15)}`;
    
    // Use PHP proxy to avoid CORS issues - use correct relative path
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
        password,
        requestId
      })
    });
    
    const data = await response.json();
    console.log("STK Push response:", data);
    
    if (data.ResponseCode === "0") {
      // Save booking details to database - use correct relative path
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
          status: "pending",
          checkout_request_id: data.CheckoutRequestID,
          merchant_request_id: data.MerchantRequestID
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

// Function to check payment status by checkout request ID
export const checkPaymentStatus = async (checkoutRequestId: string) => {
  try {
    const response = await fetch("./api/check-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        checkout_request_id: checkoutRequestId
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};

