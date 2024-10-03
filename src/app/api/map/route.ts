export async function GET(request: Request) {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!googleMapsApiKey) {
      return new Response("Google Maps API key is missing.", {
        status: 500,
      });
    }
  
    const url = new URL(request.url);
    const address = url.searchParams.get("address");
  
    if (!address) {
      return new Response("Address parameter is missing.", {
        status: 400,
      });
    }
  
    try {
      const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${googleMapsApiKey}`;
      const response = await fetch(geocodeApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        statusText: "Google Maps Data Fetched Successfully",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: (error as Error).message }),
        {
          status: 500, 
          statusText: "Internal Server Error",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  