import profileKo from "../content/data/profile.ko.json";
import profileEn from "../content/data/profile.en.json";
import timelineKo from "../content/data/timeline.ko.json";
import timelineEn from "../content/data/timeline.en.json";
import skills from "../content/data/skills.json";

const profiles = { ko: profileKo, en: profileEn };
const timelines = { ko: timelineKo, en: timelineEn };

export const getProfile = (lang) => profiles[lang];
export const getTimeline = (lang) => timelines[lang];
export const getSkills = () => skills;
