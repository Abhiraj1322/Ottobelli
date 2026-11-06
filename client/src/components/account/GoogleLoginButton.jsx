import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton() {
  const handleSuccess = (credentialResponse) => {
    console.log("Google login successful!");
    console.log(credentialResponse.credential);
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

export default GoogleLoginButton;