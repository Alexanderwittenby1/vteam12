export const fetchUserData = async (token: string) => {
  try {
    console.log("Token in fetchUserData", token);
    const response = await fetch("http://backend:4000/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
