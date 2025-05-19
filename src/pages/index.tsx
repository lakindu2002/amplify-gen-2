import { withAuthGuard } from "@/hocs/withAuthGuard";
import { NextPage } from "next";

const Home: NextPage = () => {
  return <></>;
};

export default withAuthGuard(Home);
