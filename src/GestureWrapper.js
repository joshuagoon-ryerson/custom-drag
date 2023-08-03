import React from "react";

import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useHistory } from "react-router-dom";

const handlePreventDefault = (e) => {
  // only prevent touch gestures on the side of the screen
  if (
    e.pageX > 20
    // && e.pageX < window.innerWidth - 20 // right side
  )
    return;

  // prevent swipe to navigate back gesture
  e.preventDefault();
};

export default function GestureWrapper({ children }) {
  const history = useHistory();
  const goingBack = React.useRef(false);

  // useEffect prevents the native iOS Safari back behavior
  React.useEffect(() => {
    const root = document.querySelector("#root");
    root.addEventListener("touchstart", handlePreventDefault);

    return () => {
      root.removeEventListener("touchstart", handlePreventDefault);
    };
  }, []);

  // useEffect virtually records the history stack to determine whether back is available
  React.useEffect(() => {
    return history.listen((location) => {
      const unparsedHistoryStack = sessionStorage.getItem("historyStack");
      const historyStack = unparsedHistoryStack
        ? JSON.parse(unparsedHistoryStack)
        : [];
      const historyStackLength = historyStack.length;

      if (history.action === "PUSH") {
        // new page
        historyStack.push(location.key);
        sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
      } else if (history.action === "POP") {
        if (
          (historyStackLength > 1 &&
            historyStack[historyStackLength - 2] === location.key) ||
          (historyStackLength === 1 && location.key === undefined)
        ) {
          // handle back
          historyStack.pop();
          sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
        } else {
          // handle forward
          historyStack.push(location.key);
          sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
        }
      }
    });
  }, [history]);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(({ active, movement: [mx, my], cancel }) => {
    console.log("a:", active, " b:", goingBack.current);
    if (goingBack.current && !active) goingBack.current = false;
    const windowWidth = window.innerWidth;
    if (mx < 0 || mx > windowWidth - 100) cancel();

    const unparsedHistoryStack = sessionStorage.getItem("historyStack");
    let historyStack;
    try {
      historyStack = unparsedHistoryStack
        ? JSON.parse(unparsedHistoryStack)
        : [];
    } catch (e) {
      historyStack = [];
      console.error(e);
    }

    // have the window swipe in from the right
    if (
      mx > windowWidth - 100 &&
      historyStack.length > 0 &&
      !goingBack.current &&
      active
    ) {
      if (!goingBack.current && active) {
        history.goBack();
        goingBack.current = true;
        // console.log("THIS");
      }

      api.start({ x: active ? -1 * windowWidth : 0, immediate: active });

      // api.stop();
    } else {
      goingBack.current
        ? api.start({ x: active ? -1 * windowWidth : 0, immediate: active })
        : api.start({ x: active ? mx : 0, immediate: active });
    }
  });

  return (
    <>
      <animated.div
        id="drag-area"
        {...bind()}
        style={{
          position: "absolute",
          height: "100vh",
          width: "10vw",
          backgroundColor: "#ff000033",
          zIndex: 5,
          touchAction: "none",
          x
        }}
      ></animated.div>
      <animated.div
        id="main-content"
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#33880033",
          overflowY: "hidden",
          x
        }}
      >
        {children}
      </animated.div>
    </>
  );
}
