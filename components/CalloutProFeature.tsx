import React from "react";
import { Callout } from "nextra-theme-docs";

export default function CalloutProFeature() {
    return (
     <Callout type="warning">
      This feature is only available for <b>Pro</b> and <b>Enterprise</b> plans.
		      <br/>

      <a href="https://wasmer.io/settings/billing" style={{ textDecoration: "underline" }} target="_blank">
	      Upgrade your account now
      </a>!
    </Callout>
    );
};

