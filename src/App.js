import "./App.css";

import React, { Suspense } from "react";

import { fetchProfileData } from "./fakeApi";

const SSRSuspense =
  typeof window !== "undefined"
    ? Suspense
    : ({ children, ...props }) => children;

const resource = fetchProfileData();

function ProfilePage() {
  return (
    <SSRSuspense
      suppressHydrationWarning={true}
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails />
      <SSRSuspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </SSRSuspense>
    </SSRSuspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

const App = () => {
  const testSubmit = (e) => {
    console.log("submitting!");
    e.preventDefault();
    console.log(e);
  };

  return (
    <div>
      <div>Welcome to Razzle.</div>
      <ProfilePage suppressHydrationWarning={true} />
    </div>
  );
};

export default App;
