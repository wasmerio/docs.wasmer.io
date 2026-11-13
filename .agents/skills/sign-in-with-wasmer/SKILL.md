---
name: sign-in-with-wasmer
description: Add "Sign in with Wasmer" to a web app, single-page app, CLI, or native app. Wasmer is a standard OpenID Connect provider (authorization code with PKCE). Covers client registration, redirect URI rules, the authorize redirect, code exchange, ID token validation, user info, refresh-token rotation, sign-out, and the Wasmer Services check. Use when asked to add Wasmer login or SSO to an app, configure an OIDC client for registry.wasmer.io, or debug invalid_grant, invalid_client, invalid_scope, or redirect URI errors from Wasmer.
license: MIT
metadata:
  author: wasmerio
---

# Add Sign in with Wasmer to an app

Wasmer is an OAuth 2.0 and OpenID Connect provider. An app sends the user
to wasmer.io, the user approves the app, and the app gets the user's
Wasmer identity. Facts here are verified against the Wasmer backend and
the live production discovery document. When this file and the discovery
document disagree, trust the discovery document.

## What the app gets

- The user's identity: `sub` (the permanent Wasmer user ID) and, with
  the matching scopes, name, username, avatar, and email.
- An access token that works only on the user info endpoint and the
  Wasmer Services check. It cannot call the Wasmer GraphQL API, deploy
  apps, or publish packages. No scope gives access to the account.

## Credential rules

WARNING: Never put a client secret in browser code, a mobile or desktop
binary, a repository, or the conversation. Keep it in a server-side
secret store (for apps on Wasmer Edge: `wasmer app secrets create`).
A client secret is shown only once, at registration. If it leaks, ask
Wasmer to disable the client and register a new one.

Keep refresh tokens on the server or in an `HttpOnly` cookie. A
browser-only app keeps tokens in memory, not in `localStorage`.

## Endpoints

Configure only the issuer. OIDC libraries read the other endpoints from
discovery.

| What | Production value |
|---|---|
| Issuer | `https://registry.wasmer.io` (no trailing slash) |
| Discovery | `https://registry.wasmer.io/.well-known/openid-configuration` |
| Authorization | `https://wasmer.io/oauth/authorize` |
| Token | `https://registry.wasmer.io/oauth/token` |
| User info | `https://registry.wasmer.io/oauth/userinfo` |
| JWKS | `https://registry.wasmer.io/oauth/jwks` |
| Revocation | `https://registry.wasmer.io/oauth/revoke` |

The authorization endpoint is on `wasmer.io`, not on the issuer host.
This is correct. Do not construct endpoint URLs from the issuer.

Supported: response type `code`, response mode `query`, grants
`authorization_code` and `refresh_token`, PKCE method `S256`, ID tokens
signed with `RS256`. Not supported: implicit and hybrid flows, client
credentials, device flow, dynamic client registration, and an end
session (logout) endpoint. The `/oauth/*` endpoints allow all CORS
origins, so a browser-only app can call them directly.

## Scopes and claims

| Scope | Gives |
|---|---|
| `openid` | `sub` and an ID token; required for user info |
| `profile` | `name`, `preferred_username` (the Wasmer username), `picture` (avatar URL) |
| `email` | `email`, `email_verified` |
| `services:use` | permission to use Wasmer Services for the user (see below) |

- `sub` is the Wasmer user ID as a decimal string. Key your user records
  by `sub`. Do not key them by `email` or `preferred_username`.
- `name` is the user's first and last name. It falls back to the
  username when both are empty.
- Use `email` to link to an existing account only when `email_verified`
  is `true`.

## 1. Register the app

Registration is not self-service. Wasmer staff register each app. Send
this information to support@wasmer.io:

- App name (1 to 100 characters) and an optional `https` logo URL. The
  consent screen shows both.
- Every redirect URI the app uses (local, staging, production). Rules:
  - `https`, or `http` on `localhost`, `127.0.0.1`, or `[::1]` only.
  - No fragment. Custom schemes such as `myapp://callback` are rejected.
  - Matching is exact, character for character. Scheme, host, port,
    path, trailing slash, and query string must all be the same.
- The scopes the app may request: a subset of `openid`, `profile`,
  `email`, `services:use`.
- The client type:
  - Confidential: the app has a server that keeps a secret. It gets a
    client secret that starts with `wcs_`.
  - Public: a single-page app, a native app, or a CLI. It gets no
    secret and must use PKCE.

You receive a `client_id` and, for a confidential client, the secret.

## 2. Send the user to Wasmer

Redirect the browser to the authorization endpoint with these query
parameters:

| Parameter | Value |
|---|---|
| `response_type` | `code` |
| `client_id` | your client ID |
| `redirect_uri` | one of the registered URIs, exactly. Required. |
| `scope` | space-separated, for example `openid profile email`. Required. |
| `state` | a new random value for each request; keep it in the session |
| `code_challenge` | `BASE64URL(SHA256(code_verifier))` |
| `code_challenge_method` | `S256` (`plain` is rejected) |
| `nonce` | a new random value (maximum 255 characters); keep it in the session |

- Always use PKCE, also for a confidential client. A public client
  without PKCE gets `invalid_request`.
- CAUTION: A confidential client that sends no `code_challenge` must
  also send no `code_verifier` at the token endpoint. A verifier for a
  code issued without a challenge fails with `invalid_grant`.
- `prompt` and `max_age` are ignored. You cannot force a new login or
  skip the consent screen.
- Native apps and CLIs: open the system browser and listen on a fixed
  loopback port, for example `http://127.0.0.1:8765/callback`. Register
  that exact URI, including the port.

What the user sees: a signed-out user signs in on wasmer.io first and
then returns to the request. Then the consent screen shows the app name,
logo, a first-party label for apps made by Wasmer, and one line for each
scope. Wasmer remembers the approval for each user and app. The screen
appears again only when the app requests a scope that the user has not
approved, or after the user revoked the app.

## 3. Handle the callback

- Success: `<redirect_uri>?code=...&state=...`. Make sure that `state`
  is equal to the value in the session. The code is single-use and
  expires after 120 seconds. Exchange it at once.
- Error: `<redirect_uri>?error=<code>&state=...`. `access_denied` means
  that the user denied the request. `invalid_scope` means a scope that
  is empty, unknown, or not registered for the app. `invalid_request`
  means a missing or wrong PKCE parameter or another bad parameter.
- The response has no `iss` parameter (RFC 9207). Do not require it.
- An unknown `client_id`, a disabled client, or an unregistered
  `redirect_uri` does not redirect. Wasmer shows an error page. If users
  stay on a Wasmer error page, examine these three values first.

## 4. Exchange the code

```bash
curl -X POST https://registry.wasmer.io/oauth/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -u "$WASMER_CLIENT_ID:$WASMER_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code="$CODE" \
  -d redirect_uri="$REDIRECT_URI" \
  -d code_verifier="$CODE_VERIFIER"
```

- The body must be form-encoded. A JSON body gets `400 invalid_request`.
- Client authentication:
  - Confidential: HTTP Basic (`client_secret_basic`), or `client_id`
    and `client_secret` in the body (`client_secret_post`).
  - Public: `client_id` in the body and no secret.
- `redirect_uri` must be the same value as in the authorization request.

Response (`Cache-Control: no-store`):

```json
{
  "access_token": "woa_...",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "wor_...",
  "scope": "openid profile email",
  "id_token": "eyJ..."
}
```

- The access token lives 15 minutes. Treat it as opaque: it is a JWT,
  but apps cannot verify it. Use user info to check it.
- `id_token` is present only when the scope includes `openid`.

## 5. Validate the ID token

Use your OIDC library. It must check:

- the `RS256` signature with the key from JWKS that matches the `kid`
  header;
- `iss` is exactly `https://registry.wasmer.io`;
- `aud` is your `client_id` (a string, not an array);
- `exp` has not passed;
- `nonce` is equal to the value in the session.

The ID token expires together with the access token (15 minutes). Use
it to start your own session at sign-in. Do not use it as the session.

## 6. Read user info

```bash
curl https://registry.wasmer.io/oauth/userinfo \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

- Returns the same claims as the ID token, limited to the token's scopes.
- `401 invalid_token`: the token expired or was revoked, the user
  revoked the app, the client was disabled, or the account is inactive.
- `403 insufficient_scope`: the token has no `openid` scope.

## 7. Refresh tokens

```bash
curl -X POST https://registry.wasmer.io/oauth/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d grant_type=refresh_token \
  -d refresh_token="$REFRESH_TOKEN" \
  -d client_id="$WASMER_CLIENT_ID"
```

- Client authentication is required, as for the code exchange. A public
  client sends `client_id`. Without it the response is
  `401 invalid_client`.
- Each refresh returns a new refresh token, and the old one stops
  working. Save the new refresh token before you use the new access
  token.
- WARNING: The use of a refresh token that was already rotated revokes
  the whole sign-in: all its refresh and access tokens. Two parallel
  refreshes with one token can sign the user out. Make sure that only
  one refresh runs at a time for each session (a lock or a single-flight
  promise).
- A refresh gives no new ID token. Call user info for current claims.
- A refresh token expires 30 days after it was issued. Each rotation
  issues a new one with 30 days, so active sessions continue.
- `scope` can only make the grant narrower. A wider scope gets
  `invalid_scope`.
- `invalid_grant` means that the session ended: the token expired, was
  reused, or was revoked, the user revoked the app, the client was
  disabled, or the account was deactivated. Send the user to sign in
  again.

## 8. Sign out

```bash
curl -X POST https://registry.wasmer.io/oauth/revoke \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -u "$WASMER_CLIENT_ID:$WASMER_CLIENT_SECRET" \
  -d token="$REFRESH_TOKEN"
```

- A public client sends `-d client_id=...` instead of `-u`.
- Revoke the refresh token and the access token, one request each.
  Revoking the refresh token does not stop an access token that was
  already issued.
- The endpoint returns `200` also for unknown tokens and for tokens of
  other clients. Wrong client credentials get `401 invalid_client`.
- There is no end session endpoint. Signing out of your app does not
  sign the user out of wasmer.io.
- When a user revokes your app on Wasmer, all its tokens for that user
  stop working at once.

## Wasmer Services check (`services:use`)

An app that provides a Wasmer Service asks Wasmer, from its server,
before it does work for a user:

```bash
curl -X POST https://registry.wasmer.io/api/v1/services/check \
  -H 'Content-Type: application/json' \
  -d '{"token": "<access token or null>", "service": "my-service", "units": 1}'
```

- `service`: 1 to 64 characters of `a-z`, `0-9`, and `-`. `units`
  defaults to 1. No limits apply yet. The fields are there so that
  limits can be added without changes to apps.
- A valid request always gets `200`: `{"allowed": true}`, or
  `{"allowed": false, "reason": "...", "message": "..."}` where
  `reason` is `invalid_token`, `insufficient_scope`, or
  `account_inactive`. Show `message` to the user.
- A missing or `null` token is an anonymous caller and is allowed. If
  your service requires a signed-in user, your app must enforce it.
- Only OAuth access tokens (`woa_`) with `services:use` are accepted.
  Wasmer login tokens and personal access tokens are rejected. Never ask
  users for them.

## Example: Node.js server with openid-client 6

```js
import * as oidc from 'openid-client'

const issuer = new URL('https://registry.wasmer.io')
const redirectUri = 'https://app.example.com/auth/wasmer/callback'

// Confidential client. For a public client:
// oidc.discovery(issuer, clientId, undefined, oidc.None())
const config = await oidc.discovery(
  issuer,
  process.env.WASMER_CLIENT_ID,
  process.env.WASMER_CLIENT_SECRET,
)

// GET /auth/wasmer: start the sign-in.
export async function start(session) {
  session.codeVerifier = oidc.randomPKCECodeVerifier()
  session.state = oidc.randomState()
  session.nonce = oidc.randomNonce()
  return oidc.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    code_challenge: await oidc.calculatePKCECodeChallenge(session.codeVerifier),
    code_challenge_method: 'S256',
    state: session.state,
    nonce: session.nonce,
  })
}

// GET /auth/wasmer/callback: finish the sign-in.
export async function callback(session, publicCallbackUrl) {
  const tokens = await oidc.authorizationCodeGrant(config, publicCallbackUrl, {
    pkceCodeVerifier: session.codeVerifier,
    expectedState: session.state,
    expectedNonce: session.nonce,
  })
  const claims = tokens.claims() // sub, name, preferred_username, email, ...
  return { claims, tokens }
}
```

- `authorizationCodeGrant` sends the callback URL without its query
  string as `redirect_uri`. Register a redirect URI without a query
  string, and build `publicCallbackUrl` from the public origin, not from
  an internal host behind a proxy.
- Other OIDC libraries work the same way. Configure the issuer, the
  client ID, the secret (confidential only), PKCE `S256`, and a nonce.

## Debug

| Symptom | Cause |
|---|---|
| Wasmer error page, no redirect | unknown or disabled `client_id`, or `redirect_uri` not registered exactly |
| `error=invalid_scope` on the callback | scope empty, unknown, or not registered for the client |
| `error=invalid_request` on the callback | public client without PKCE, or `code_challenge_method=plain` |
| `invalid_grant` on code exchange | code older than 120 s or used twice, `redirect_uri` differs, wrong `code_verifier`, or verifier sent for a code without challenge |
| `invalid_client` (401) | wrong secret, secret missing for a confidential client, or no `client_id` on refresh or revoke |
| `invalid_request` (400) on token | body is not `application/x-www-form-urlencoded`, or `grant_type` missing |
| Users signed out at random | parallel refreshes with one refresh token revoked the sign-in |
| ID token `iss` mismatch | issuer configured with a trailing slash |

## Wasmer staff: register and disable clients

Staff register clients with the GraphQL API at
`https://registry.wasmer.io/graphql`, signed in as a staff user:

```graphql
mutation {
  createOAuthClient(input: {
    name: "Example App"
    logoUrl: "https://example.com/logo.png"
    redirectUris: ["https://app.example.com/auth/wasmer/callback"]
    allowedScopes: ["openid", "profile", "email"]
    confidential: true
    isFirstParty: false
  }) {
    client { clientId redirectUris allowedScopes }
    clientSecret
  }
}
```

- `clientSecret` is returned only in this response. Send it to the app
  owner through a secret channel, never in a ticket or chat.
- `isFirstParty: true` labels the app as made by Wasmer. The consent
  screen still appears.
- `disableOAuthClient(clientId: "...")` stops sign-in, refresh, and all
  issued access tokens of the client at once.
- Wasmer's dev environment uses the issuer `https://registry.wasmer.wtf`
  and the authorization page `https://wasmer.wtf/oauth/authorize`.
  Clients are registered for each environment separately.
