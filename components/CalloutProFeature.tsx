import React from "react";
import { Callout } from '@components/nextra-theme';

export default function CalloutProFeature() {
    return (
     <Callout>
      This feature is only available for <b>Pro</b> and <b>Enterprise</b> plans.
		      <br/>

      <a href="https://wasmer.io/pro" style={{ textDecoration: "underline" }} target="_blank">
        Upgrade your account to Pro
      </a>!
    </Callout>
    );
};
