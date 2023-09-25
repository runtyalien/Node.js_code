document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit" , async(e) => {
        e.preventDefault();

        const formData = new FormData(signupForm);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if(response.ok){
                alert("Sign up successful");
            } else {
                alert("Signup failed, Please try again");
            }
        } catch(error){
            console.error("Error:", error);
        }
    });
});
