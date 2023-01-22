import React, { useCallback, useEffect, useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { encode } from "querystring";

const FEEDBACK_PROMPTS = [
  "I wish this tool had...",
  "I wish this tool could...",
  "I love that this tool can...",
  "I hate that this tool...",
  "",
];

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    setFeedback(
      FEEDBACK_PROMPTS[Math.floor(Math.random() * FEEDBACK_PROMPTS.length)]
    );
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // send form to netlify. 404s at localhost.
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "feedback", feedback }),
      });

      alert("Thanks for your feedback!");
      setFeedback("");
    },
    [feedback]
  );

  return (
    <>
      <Grid container direction={"column"} spacing={1}>
        <Grid item>
          {/* full-width text field */}
          <TextField
            label={"Your feedback"}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant={"contained"} color={"primary"} onClick={onSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
