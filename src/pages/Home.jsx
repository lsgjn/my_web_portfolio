import FeaturedProjects from "../components/home/FeaturedProjects.jsx";
import Hero from "../components/home/Hero.jsx";
import LatestPosts from "../components/home/LatestPosts.jsx";
import Skills from "../components/home/Skills.jsx";
import WorkWithMe from "../components/home/WorkWithMe.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import { getProfile } from "../functions/data.js";
import { useLang } from "../functions/i18n.js";

export default function Home() {
  const p = getProfile(useLang());
  return (
    <PageFrame title={p.name} description={p.intro}>
      <Hero />
      <FeaturedProjects />
      <Skills />
      <LatestPosts />
      <WorkWithMe />
    </PageFrame>
  );
}
