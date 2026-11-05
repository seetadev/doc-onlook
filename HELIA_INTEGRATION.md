# Helia integration: assessment

Status: **assessment only. No Helia code is proposed or included.** The question was whether a meaningful Helia (IPFS) integration point exists in doc-onlook. The answer is: **a narrow one, not worth building now.** This file records why, so the question does not have to be re-derived, and what would have to exist first.

## What doc-onlook does (read from the source)

A UWP (Universal Windows Platform) viewer, targeting Windows 10 SDK 10.0.10586 (minimum 10.0.10240), built with `project.json`.

- `MainPage.RunTCPListener` binds a `StreamSocketListener` on **TCP port 2112** (`MainPage.xaml.cs`).
- `OnConnection` reads the request with a hand-written parser into **one in-memory string**, takes `Content-Length`, and waits until the string is that long. `ParseContent` reads `name`, `type`, `data` and `action` from the form body.
- Actions: `FIND_DEVICE` (answers with the device's IP) and `SEND_FILE`. A file arrives as form data: text types as text, `.png`, `.jpg` and `.pdf` as base64. Types handled: `.csv`, `.txt`, `.html`, `.png`, `.jpg`, `.pdf`; anything else is "Can't write file". The file is written to `ApplicationData.LocalCacheFolder` and shown in the app.
- The reference sender is `Sender Sample/doc-onlook.js`, a jQuery `POST` from a web page to `http://<device-ip>:2112`. The replies carry `Access-Control-Allow-Origin: *`.
- Capabilities: `internetClient`, `internetClientServer`, `privateNetworkClientServer`, microphone (voice command "show my latest file").
- There is **no authentication, no TLS, no tests and no CI**.

## The one plausible integration point

A new action, `SEND_CID`: the sender uploads a document to Helia once and pushes only a small message `{name, type, cid, sha256}`; the viewer fetches the bytes over HTTP, checks `sha256`, and stores the file as it does today.

What that would buy:
- Large files: today a payload is held as a single string and sent as base64 (about a third larger than the file).
- One upload, several viewers.
- Works when sender and viewer are not on the same LAN.
- Integrity: the viewer can verify what it got.

## Why it is not worth building now

**a. The viewer cannot hold the sidecar secret, and there is nothing to authenticate against yet.** The Helia sidecar requires a shared secret (`X-Meshkit-Helia-Token`) on every route except `/health`; the secret must stay server-side. A Windows app that ships to users cannot keep it. The viewer would have to go through a proxy that authenticates the caller. The existing Tornado proxy (`/meshkit-helia/*` in `seetadev/Tornado-Backend-Stack`) has **no caller authentication**, and a per-user token path for non-browser clients has been designed but deliberately not built, pending a product decision on whether such clients should require accounts.

**b. The product fit is weak.** doc-onlook's point is pushing a file to a nearby device with no account and no server. Helia adds a server dependency (the sidecar, a proxy, accounts) to a workflow whose value is not needing one. The size benefit is real but small for the documents it handles, and a fix to the existing transfer (stream the body instead of buffering a string) would address it without any of that.

**c. Nothing written for it could be verified here.** The app is UWP C#. It cannot be built or run without a Windows build environment with the UWP workload and the 10586 SDK, and there is no test project and no CI. Anything added would be unbuilt and untested code, which is not an acceptable bar for this work.

## What would be needed if it is wanted later

1. **An authenticated proxy** in front of the sidecar for non-browser clients (the per-user token path above, or another agreed scheme), plus the per-user `/list` and `/health` it depends on. Until it exists, no client that ships to users can use Helia safely.
2. **A Windows build environment**: Visual Studio with the UWP workload and the Windows 10 SDK 10.0.10586 (or a retarget to a current SDK, which is a migration in its own right: `project.json` is the old project format), and a CI runner (a `windows-latest` job running MSBuild) so changes are built on every push. A unit-test project for the receive path and the new client.
3. **Hardening of the receive path first.** Today any host on the LAN, and any web page the user visits (the replies allow every origin), can push files to port 2112 without authentication. A `SEND_CID` action would add a way to make the device make outbound requests on the sender's say-so; it must not be added to an unauthenticated listener.
4. **The same client contract as the other apps** (put, get, health, local CID checks, no redirects, no secret in logs), written against the sidecar contract in `seetadev/Tornado-Backend-Stack` PR #15. Reference implementations with mock-sidecar tests and an opt-in real-sidecar test exist for Python (Tornado, Django) and JavaScript in the other repos.
5. **Encryption**, if the documents are private: the sidecar stores bytes as given, has no delete and a global listing, so anything private must be encrypted before upload.

## Decision recorded

No Helia scaffold in this repository. Revisit if (1) and (2) exist and there is a concrete need for large or multi-viewer transfers.
