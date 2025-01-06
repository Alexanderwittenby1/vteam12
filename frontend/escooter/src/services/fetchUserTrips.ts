export const fetchTripData = async (token: string) => {
  try {
    console.log("Token in fetchTripData", token);
    const response = await fetch("http://backend:4000/user/trips", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch profile", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};
