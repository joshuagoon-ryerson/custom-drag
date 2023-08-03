import React from "react";

function isSafari() {
  const ua = window.navigator.userAgent;
  const iOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
  const webkit = ua.match(/WebKit/i);
  const iOSSafari = Boolean(iOS && webkit && !ua.match(/CriOS/i));
  return iOSSafari;
  // https://codepen.io/Orb89/pen/XRBZYN
}

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      Loading
    </div>
  );
}

export default function GestureWrapperLayer({ children }) {
  const isiOSSafari = isSafari();

  // render regular children if not iOS Safari
  // (recomment this in to work only on safari)
  // if (!isiOSSafari) return <>{children}</>;

  // lazy import component, so animation dependencies are not added to initial bundle
  const GestureWrapper = React.lazy(() => import("./GestureWrapper"));

  return (
    <React.Suspense fallback={<Loader />}>
      <GestureWrapper>{children}</GestureWrapper>;
    </React.Suspense>
  );
}
