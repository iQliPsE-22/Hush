import Chatpage from "./../components/Chatpage";

const page = async ({ params }) => {
  const recipient = (await params).chatPage;
  console.log("recipient", recipient);
  return <Chatpage currentChat={recipient} />;
};

export default page;
