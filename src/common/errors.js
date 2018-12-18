// @flow
// Generated from https://cs.chromium.org/chromium/src/net/base/net_error_list.h

// An asynchronous IO operation is not yet complete.  This usually does not
// indicate a fatal error.  Typically this error will be generated as a
// notification to wait for some external notification that the IO operation
// finally completed.
export const ERR_IO_PENDING = -1;

// A generic failure occurred.
export const ERR_FAILED = -2;

// An operation was aborted (due to user action).
export const ERR_ABORTED = -3;

// An argument to the function is incorrect.
export const ERR_INVALID_ARGUMENT = -4;

// The handle or file descriptor is invalid.
export const ERR_INVALID_HANDLE = -5;

// The file or directory cannot be found.
export const ERR_FILE_NOT_FOUND = -6;

// An operation timed out.
export const ERR_TIMED_OUT = -7;

// The file is too large.
export const ERR_FILE_TOO_BIG = -8;

// An unexpected error.  This may be caused by a programming mistake or an
// invalid assumption.
export const ERR_UNEXPECTED = -9;

// Permission to access a resource, other than the network, was denied.
export const ERR_ACCESS_DENIED = -10;

// The operation failed because of unimplemented functionality.
export const ERR_NOT_IMPLEMENTED = -11;

// There were not enough resources to complete the operation.
export const ERR_INSUFFICIENT_RESOURCES = -12;

// Memory allocation failed.
export const ERR_OUT_OF_MEMORY = -13;

// The file upload failed because the file's modification time was different
// from the expectation.
export const ERR_UPLOAD_FILE_CHANGED = -14;

// The socket is not connected.
export const ERR_SOCKET_NOT_CONNECTED = -15;

// The file already exists.
export const ERR_FILE_EXISTS = -16;

// The path or file name is too long.
export const ERR_FILE_PATH_TOO_LONG = -17;

// Not enough room left on the disk.
export const ERR_FILE_NO_SPACE = -18;

// The file has a virus.
export const ERR_FILE_VIRUS_INFECTED = -19;

// The client chose to block the request.
export const ERR_BLOCKED_BY_CLIENT = -20;

// The network changed.
export const ERR_NETWORK_CHANGED = -21;

// The request was blocked by the URL blacklist configured by the domain
// administrator.
export const ERR_BLOCKED_BY_ADMINISTRATOR = -22;

// The socket is already connected.
export const ERR_SOCKET_IS_CONNECTED = -23;

// The request was blocked because the forced reenrollment check is still
// pending. This error can only occur on ChromeOS.
// The error can be emitted by code in chrome/browser/policy/policy_helpers.cc.
export const ERR_BLOCKED_ENROLLMENT_CHECK_PENDING = -24;

// The upload failed because the upload stream needed to be re-read, due to a
// retry or a redirect, but the upload stream doesn't support that operation.
export const ERR_UPLOAD_STREAM_REWIND_NOT_SUPPORTED = -25;

// The request failed because the URLRequestContext is shutting down, or has
// been shut down.
export const ERR_CONTEXT_SHUT_DOWN = -26;

// The request failed because the response was delivered along with requirements
// which are not met ('X-Frame-Options' and 'Content-Security-Policy' ancestor
// checks, for instance).
export const ERR_BLOCKED_BY_RESPONSE = -27;

// The request failed after the response was received, based on client-side
// heuristics that point to the possiblility of a cross-site scripting attack.
export const ERR_BLOCKED_BY_XSS_AUDITOR = -28;

// The request was blocked by system policy disallowing some or all cleartext
// requests. Used for NetworkSecurityPolicy on Android.
export const ERR_CLEARTEXT_NOT_PERMITTED = -29;

// A connection was closed (corresponding to a TCP FIN).
export const ERR_CONNECTION_CLOSED = -100;

// A connection was reset (corresponding to a TCP RST).
export const ERR_CONNECTION_RESET = -101;

// A connection attempt was refused.
export const ERR_CONNECTION_REFUSED = -102;

// A connection timed out as a result of not receiving an ACK for data sent.
// This can include a FIN packet that did not get ACK'd.
export const ERR_CONNECTION_ABORTED = -103;

// A connection attempt failed.
export const ERR_CONNECTION_FAILED = -104;

// The host name could not be resolved.
export const ERR_NAME_NOT_RESOLVED = -105;

// The Internet connection has been lost.
export const ERR_INTERNET_DISCONNECTED = -106;

// An SSL protocol error occurred.
export const ERR_SSL_PROTOCOL_ERROR = -107;

// The IP address or port number is invalid (e.g., cannot connect to the IP
// address 0 or the port 0).
export const ERR_ADDRESS_INVALID = -108;

// The IP address is unreachable.  This usually means that there is no route to
// the specified host or network.
export const ERR_ADDRESS_UNREACHABLE = -109;

// The server requested a client certificate for SSL client authentication.
export const ERR_SSL_CLIENT_AUTH_CERT_NEEDED = -110;

// A tunnel connection through the proxy could not be established.
export const ERR_TUNNEL_CONNECTION_FAILED = -111;

// No SSL protocol versions are enabled.
export const ERR_NO_SSL_VERSIONS_ENABLED = -112;

// The client and server don't support a common SSL protocol version or
// cipher suite.
export const ERR_SSL_VERSION_OR_CIPHER_MISMATCH = -113;

// The server requested a renegotiation (rehandshake).
export const ERR_SSL_RENEGOTIATION_REQUESTED = -114;

// The proxy requested authentication (for tunnel establishment) with an
// unsupported method.
export const ERR_PROXY_AUTH_UNSUPPORTED = -115;

// During SSL renegotiation (rehandshake), the server sent a certificate with
// an error.
//
// Note: this error is not in the -2xx range so that it won't be handled as a
// certificate error.
export const ERR_CERT_ERROR_IN_SSL_RENEGOTIATION = -116;

// The SSL handshake failed because of a bad or missing client certificate.
export const ERR_BAD_SSL_CLIENT_AUTH_CERT = -117;

// A connection attempt timed out.
export const ERR_CONNECTION_TIMED_OUT = -118;

// There are too many pending DNS resolves, so a request in the queue was
// aborted.
export const ERR_HOST_RESOLVER_QUEUE_TOO_LARGE = -119;

// Failed establishing a connection to the SOCKS proxy server for a target host.
export const ERR_SOCKS_CONNECTION_FAILED = -120;

// The SOCKS proxy server failed establishing connection to the target host
// because that host is unreachable.
export const ERR_SOCKS_CONNECTION_HOST_UNREACHABLE = -121;

// The request to negotiate an alternate protocol failed.
export const ERR_ALPN_NEGOTIATION_FAILED = -122;

// The peer sent an SSL no_renegotiation alert message.
export const ERR_SSL_NO_RENEGOTIATION = -123;

// Winsock sometimes reports more data written than passed.  This is probably
// due to a broken LSP.
export const ERR_WINSOCK_UNEXPECTED_WRITTEN_BYTES = -124;

// An SSL peer sent us a fatal decompression_failure alert. This typically
// occurs when a peer selects DEFLATE compression in the mistaken belief that
// it supports it.
export const ERR_SSL_DECOMPRESSION_FAILURE_ALERT = -125;

// An SSL peer sent us a fatal bad_record_mac alert. This has been observed
// from servers with buggy DEFLATE support.
export const ERR_SSL_BAD_RECORD_MAC_ALERT = -126;

// The proxy requested authentication (for tunnel establishment).
export const ERR_PROXY_AUTH_REQUESTED = -127;

// The SSL server attempted to use a weak ephemeral Diffie-Hellman key.
export const ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY = -129;

// Could not create a connection to the proxy server. An error occurred
// either in resolving its name, or in connecting a socket to it.
// Note that this does NOT include failures during the actual "CONNECT" method
// of an HTTP proxy.
export const ERR_PROXY_CONNECTION_FAILED = -130;

// A mandatory proxy configuration could not be used. Currently this means
// that a mandatory PAC script could not be fetched, parsed or executed.
export const ERR_MANDATORY_PROXY_CONFIGURATION_FAILED = -131;

// -132 was formerly ERR_ESET_ANTI_VIRUS_SSL_INTERCEPTION

// We've hit the max socket limit for the socket pool while preconnecting.  We
// don't bother trying to preconnect more sockets.
export const ERR_PRECONNECT_MAX_SOCKET_LIMIT = -133;

// The permission to use the SSL client certificate's private key was denied.
export const ERR_SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED = -134;

// The SSL client certificate has no private key.
export const ERR_SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY = -135;

// The certificate presented by the HTTPS Proxy was invalid.
export const ERR_PROXY_CERTIFICATE_INVALID = -136;

// An error occurred when trying to do a name resolution (DNS).
export const ERR_NAME_RESOLUTION_FAILED = -137;

// Permission to access the network was denied. This is used to distinguish
// errors that were most likely caused by a firewall from other access denied
// errors. See also ERR_ACCESS_DENIED.
export const ERR_NETWORK_ACCESS_DENIED = -138;

// The request throttler module cancelled this request to avoid DDOS.
export const ERR_TEMPORARILY_THROTTLED = -139;

// A request to create an SSL tunnel connection through the HTTPS proxy
// received a non-200 (OK) and non-407 (Proxy Auth) response.  The response
// body might include a description of why the request failed.
export const ERR_HTTPS_PROXY_TUNNEL_RESPONSE = -140;

// We were unable to sign the CertificateVerify data of an SSL client auth
// handshake with the client certificate's private key.
//
// Possible causes for this include the user implicitly or explicitly
// denying access to the private key, the private key may not be valid for
// signing, the key may be relying on a cached handle which is no longer
// valid, or the CSP won't allow arbitrary data to be signed.
export const ERR_SSL_CLIENT_AUTH_SIGNATURE_FAILED = -141;

// The message was too large for the transport.  (for example a UDP message
// which exceeds size threshold).
export const ERR_MSG_TOO_BIG = -142;

// A SPDY session already exists, and should be used instead of this connection.
export const ERR_SPDY_SESSION_ALREADY_EXISTS = -143;

// Error -144 was removed (LIMIT_VIOLATION).

// Websocket protocol error. Indicates that we are terminating the connection
// due to a malformed frame or other protocol violation.
export const ERR_WS_PROTOCOL_ERROR = -145;

// Error -146 was removed (PROTOCOL_SWITCHED)

// Returned when attempting to bind an address that is already in use.
export const ERR_ADDRESS_IN_USE = -147;

// An operation failed because the SSL handshake has not completed.
export const ERR_SSL_HANDSHAKE_NOT_COMPLETED = -148;

// SSL peer's public key is invalid.
export const ERR_SSL_BAD_PEER_PUBLIC_KEY = -149;

// The certificate didn't match the built-in public key pins for the host name.
// The pins are set in net/http/transport_security_state.cc and require that
// one of a set of public keys exist on the path from the leaf to the root.
export const ERR_SSL_PINNED_KEY_NOT_IN_CERT_CHAIN = -150;

// Server request for client certificate did not contain any types we support.
export const ERR_CLIENT_AUTH_CERT_TYPE_UNSUPPORTED = -151;

// Server requested one type of cert, then requested a different type while the
// first was still being generated.
export const ERR_ORIGIN_BOUND_CERT_GENERATION_TYPE_MISMATCH = -152;

// An SSL peer sent us a fatal decrypt_error alert. This typically occurs when
// a peer could not correctly verify a signature (in CertificateVerify or
// ServerKeyExchange) or validate a Finished message.
export const ERR_SSL_DECRYPT_ERROR_ALERT = -153;

// There are too many pending WebSocketJob instances, so the new job was not
// pushed to the queue.
export const ERR_WS_THROTTLE_QUEUE_TOO_LARGE = -154;

// Error -155 was removed (TOO_MANY_SOCKET_STREAMS)

// The SSL server certificate changed in a renegotiation.
export const ERR_SSL_SERVER_CERT_CHANGED = -156;

// Error -157 was removed (SSL_INAPPROPRIATE_FALLBACK).

// Error -158 was removed (CT_NO_SCTS_VERIFIED_OK).

// The SSL server sent us a fatal unrecognized_name alert.
export const ERR_SSL_UNRECOGNIZED_NAME_ALERT = -159;

// Failed to set the socket's receive buffer size as requested.
export const ERR_SOCKET_SET_RECEIVE_BUFFER_SIZE_ERROR = -160;

// Failed to set the socket's send buffer size as requested.
export const ERR_SOCKET_SET_SEND_BUFFER_SIZE_ERROR = -161;

// Failed to set the socket's receive buffer size as requested, despite success
// return code from setsockopt.
export const ERR_SOCKET_RECEIVE_BUFFER_SIZE_UNCHANGEABLE = -162;

// Failed to set the socket's send buffer size as requested, despite success
// return code from setsockopt.
export const ERR_SOCKET_SEND_BUFFER_SIZE_UNCHANGEABLE = -163;

// Failed to import a client certificate from the platform store into the SSL
// library.
export const ERR_SSL_CLIENT_AUTH_CERT_BAD_FORMAT = -164;

// Error -165 was removed (SSL_FALLBACK_BEYOND_MINIMUM_VERSION).

// Resolving a hostname to an IP address list included the IPv4 address
// "127.0.53.53". This is a special IP address which ICANN has recommended to
// indicate there was a name collision, and alert admins to a potential
// problem.
export const ERR_ICANN_NAME_COLLISION = -166;

// The SSL server presented a certificate which could not be decoded. This is
// not a certificate error code as no X509Certificate object is available. This
// error is fatal.
export const ERR_SSL_SERVER_CERT_BAD_FORMAT = -167;

// Certificate Transparency: Received a signed tree head that failed to parse.
export const ERR_CT_STH_PARSING_FAILED = -168;

// Certificate Transparency: Received a signed tree head whose JSON parsing was
// OK but was missing some of the fields.
export const ERR_CT_STH_INCOMPLETE = -169;

// The attempt to reuse a connection to send proxy auth credentials failed
// before the AuthController was used to generate credentials. The caller should
// reuse the controller with a new connection. This error is only used
// internally by the network stack.
export const ERR_UNABLE_TO_REUSE_CONNECTION_FOR_PROXY_AUTH = -170;

// Certificate Transparency: Failed to parse the received consistency proof.
export const ERR_CT_CONSISTENCY_PROOF_PARSING_FAILED = -171;

// The SSL server required an unsupported cipher suite that has since been
// removed. This error will temporarily be signaled on a fallback for one or two
// releases immediately following a cipher suite's removal, after which the
// fallback will be removed.
export const ERR_SSL_OBSOLETE_CIPHER = -172;

// When a WebSocket handshake is done successfully and the connection has been
// upgraded, the URLRequest is cancelled with this error code.
export const ERR_WS_UPGRADE = -173;

// Socket ReadIfReady support is not implemented. This error should not be user
// visible, because the normal Read() method is used as a fallback.
export const ERR_READ_IF_READY_NOT_IMPLEMENTED = -174;

// This error is emitted if TLS 1.3 is enabled, connecting with it failed, but
// retrying at a downgraded maximum version succeeded. This could mean:
//
// 1. This is a transient network error that will be resolved when the user
//    reloads.
//
// 2. The user is behind a buggy network middlebox, firewall, or proxy which is
//    interfering with TLS 1.3.
//
// 3. The server is buggy and does not implement TLS version negotiation
//    correctly. TLS 1.3 was tweaked to avoid a common server bug here, so this
//    is unlikely.
export const ERR_SSL_VERSION_INTERFERENCE = -175;

// No socket buffer space is available.
export const ERR_NO_BUFFER_SPACE = -176;

// There were no common signature algorithms between our client certificate
// private key and the server's preferences.
export const ERR_SSL_CLIENT_AUTH_NO_COMMON_ALGORITHMS = -177;

// TLS 1.3 early data was rejected by the server. This will be received before
// any data is returned from the socket. The request should be retried with
// early data disabled.
export const ERR_EARLY_DATA_REJECTED = -178;

// TLS 1.3 early data was offered, but the server responded with TLS 1.2 or
// earlier. This is an internal error code to account for a
// backwards-compatibility issue with early data and TLS 1.2. It will be
// received before any data is returned from the socket. The request should be
// retried with early data disabled.
//
// See https://tools.ietf.org/html/rfc8446#appendix-D.3 for details.
export const ERR_WRONG_VERSION_ON_EARLY_DATA = -179;

// TLS 1.3 was enabled, but a lower version was negotiated and the server
// returned a value indicating it supported TLS 1.3. This is part of a security
// check in TLS 1.3, but it may also indicate the user is behind a buggy
// TLS-terminating proxy which implemented TLS 1.2 incorrectly. (See
// https://crbug.com/boringssl/226.)
export const ERR_TLS13_DOWNGRADE_DETECTED = -180;

// Certificate error codes
//
// The values of certificate error codes must be consecutive.

// The server responded with a certificate whose common name did not match
// the host name.  This could mean:
//
// 1. An attacker has redirected our traffic to their server and is
//    presenting a certificate for which they know the private key.
//
// 2. The server is misconfigured and responding with the wrong cert.
//
// 3. The user is on a wireless network and is being redirected to the
//    network's login page.
//
// 4. The OS has used a DNS search suffix and the server doesn't have
//    a certificate for the abbreviated name in the address bar.
//
export const ERR_CERT_COMMON_NAME_INVALID = -200;

// The server responded with a certificate that, by our clock, appears to
// either not yet be valid or to have expired.  This could mean:
//
// 1. An attacker is presenting an old certificate for which they have
//    managed to obtain the private key.
//
// 2. The server is misconfigured and is not presenting a valid cert.
//
// 3. Our clock is wrong.
//
export const ERR_CERT_DATE_INVALID = -201;

// The server responded with a certificate that is signed by an authority
// we don't trust.  The could mean:
//
// 1. An attacker has substituted the real certificate for a cert that
//    contains their public key and is signed by their cousin.
//
// 2. The server operator has a legitimate certificate from a CA we don't
//    know about, but should trust.
//
// 3. The server is presenting a self-signed certificate, providing no
//    defense against active attackers (but foiling passive attackers).
//
export const ERR_CERT_AUTHORITY_INVALID = -202;

// The server responded with a certificate that contains errors.
// This error is not recoverable.
//
// MSDN describes this error as follows:
//   "The SSL certificate contains errors."
// NOTE: It's unclear how this differs from ERR_CERT_INVALID. For consistency,
// use that code instead of this one from now on.
//
export const ERR_CERT_CONTAINS_ERRORS = -203;

// The certificate has no mechanism for determining if it is revoked.  In
// effect, this certificate cannot be revoked.
export const ERR_CERT_NO_REVOCATION_MECHANISM = -204;

// Revocation information for the security certificate for this site is not
// available.  This could mean:
//
// 1. An attacker has compromised the private key in the certificate and is
//    blocking our attempt to find out that the cert was revoked.
//
// 2. The certificate is unrevoked, but the revocation server is busy or
//    unavailable.
//
export const ERR_CERT_UNABLE_TO_CHECK_REVOCATION = -205;

// The server responded with a certificate has been revoked.
// We have the capability to ignore this error, but it is probably not the
// thing to do.
export const ERR_CERT_REVOKED = -206;

// The server responded with a certificate that is invalid.
// This error is not recoverable.
//
// MSDN describes this error as follows:
//   "The SSL certificate is invalid."
//
export const ERR_CERT_INVALID = -207;

// The server responded with a certificate that is signed using a weak
// signature algorithm.
export const ERR_CERT_WEAK_SIGNATURE_ALGORITHM = -208;

// -209 is availible: was CERT_NOT_IN_DNS.

// The host name specified in the certificate is not unique.
export const ERR_CERT_NON_UNIQUE_NAME = -210;

// The server responded with a certificate that contains a weak key (e.g.
// a too-small RSA key).
export const ERR_CERT_WEAK_KEY = -211;

// The certificate claimed DNS names that are in violation of name constraints.
export const ERR_CERT_NAME_CONSTRAINT_VIOLATION = -212;

// The certificate's validity period is too long.
export const ERR_CERT_VALIDITY_TOO_LONG = -213;

// Certificate Transparency was required for this connection, but the server
// did not provide CT information that complied with the policy.
export const ERR_CERTIFICATE_TRANSPARENCY_REQUIRED = -214;

// The certificate chained to a legacy Symantec root that is no longer trusted.
// https://g.co/chrome/symantecpkicerts
export const ERR_CERT_SYMANTEC_LEGACY = -215;

// Add new certificate error codes here.
//
// Update the value of CERT_END whenever you add a new certificate error
// code.

// The value immediately past the last certificate error code.
export const ERR_CERT_END = -216;

// The URL is invalid.
export const ERR_INVALID_URL = -300;

// The scheme of the URL is disallowed.
export const ERR_DISALLOWED_URL_SCHEME = -301;

// The scheme of the URL is unknown.
export const ERR_UNKNOWN_URL_SCHEME = -302;

// Attempting to load an URL resulted in a redirect to an invalid URL.
export const ERR_INVALID_REDIRECT = -303;

// Attempting to load an URL resulted in too many redirects.
export const ERR_TOO_MANY_REDIRECTS = -310;

// Attempting to load an URL resulted in an unsafe redirect (e.g., a redirect
// to file:// is considered unsafe).
export const ERR_UNSAFE_REDIRECT = -311;

// Attempting to load an URL with an unsafe port number.  These are port
// numbers that correspond to services, which are not robust to spurious input
// that may be constructed as a result of an allowed web construct (e.g., HTTP
// looks a lot like SMTP, so form submission to port 25 is denied).
export const ERR_UNSAFE_PORT = -312;

// The server's response was invalid.
export const ERR_INVALID_RESPONSE = -320;

// Error in chunked transfer encoding.
export const ERR_INVALID_CHUNKED_ENCODING = -321;

// The server did not support the request method.
export const ERR_METHOD_NOT_SUPPORTED = -322;

// The response was 407 (Proxy Authentication Required), yet we did not send
// the request to a proxy.
export const ERR_UNEXPECTED_PROXY_AUTH = -323;

// The server closed the connection without sending any data.
export const ERR_EMPTY_RESPONSE = -324;

// The headers section of the response is too large.
export const ERR_RESPONSE_HEADERS_TOO_BIG = -325;

// The PAC requested by HTTP did not have a valid status code (non-200).
export const ERR_PAC_STATUS_NOT_OK = -326;

// The evaluation of the PAC script failed.
export const ERR_PAC_SCRIPT_FAILED = -327;

// The response was 416 (Requested range not satisfiable) and the server cannot
// satisfy the range requested.
export const ERR_REQUEST_RANGE_NOT_SATISFIABLE = -328;

// The identity used for authentication is invalid.
export const ERR_MALFORMED_IDENTITY = -329;

// Content decoding of the response body failed.
export const ERR_CONTENT_DECODING_FAILED = -330;

// An operation could not be completed because all network IO
// is suspended.
export const ERR_NETWORK_IO_SUSPENDED = -331;

// FLIP data received without receiving a SYN_REPLY on the stream.
export const ERR_SYN_REPLY_NOT_RECEIVED = -332;

// Converting the response to target encoding failed.
export const ERR_ENCODING_CONVERSION_FAILED = -333;

// The server sent an FTP directory listing in a format we do not understand.
export const ERR_UNRECOGNIZED_FTP_DIRECTORY_LISTING_FORMAT = -334;

// Obsolete.  Was only logged in NetLog when an HTTP/2 pushed stream expired.
// export const ERR_INVALID_SPDY_STREAM = -335;

// There are no supported proxies in the provided list.
export const ERR_NO_SUPPORTED_PROXIES = -336;

// There is a SPDY protocol error.
export const ERR_SPDY_PROTOCOL_ERROR = -337;

// Credentials could not be established during HTTP Authentication.
export const ERR_INVALID_AUTH_CREDENTIALS = -338;

// An HTTP Authentication scheme was tried which is not supported on this
// machine.
export const ERR_UNSUPPORTED_AUTH_SCHEME = -339;

// Detecting the encoding of the response failed.
export const ERR_ENCODING_DETECTION_FAILED = -340;

// (GSSAPI) No Kerberos credentials were available during HTTP Authentication.
export const ERR_MISSING_AUTH_CREDENTIALS = -341;

// An unexpected, but documented, SSPI or GSSAPI status code was returned.
export const ERR_UNEXPECTED_SECURITY_LIBRARY_STATUS = -342;

// The environment was not set up correctly for authentication (for
// example, no KDC could be found or the principal is unknown.
export const ERR_MISCONFIGURED_AUTH_ENVIRONMENT = -343;

// An undocumented SSPI or GSSAPI status code was returned.
export const ERR_UNDOCUMENTED_SECURITY_LIBRARY_STATUS = -344;

// The HTTP response was too big to drain.
export const ERR_RESPONSE_BODY_TOO_BIG_TO_DRAIN = -345;

// The HTTP response contained multiple distinct Content-Length headers.
export const ERR_RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH = -346;

// SPDY Headers have been received, but not all of them - status or version
// headers are missing, so we're expecting additional frames to complete them.
export const ERR_INCOMPLETE_SPDY_HEADERS = -347;

// No PAC URL configuration could be retrieved from DHCP. This can indicate
// either a failure to retrieve the DHCP configuration, or that there was no
// PAC URL configured in DHCP.
export const ERR_PAC_NOT_IN_DHCP = -348;

// The HTTP response contained multiple Content-Disposition headers.
export const ERR_RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION = -349;

// The HTTP response contained multiple Location headers.
export const ERR_RESPONSE_HEADERS_MULTIPLE_LOCATION = -350;

// HTTP/2 server refused the request without processing, and sent either a
// GOAWAY frame with error code NO_ERROR and Last-Stream-ID lower than the
// stream id corresponding to the request indicating that this request has not
// been processed yet, or a RST_STREAM frame with error code REFUSED_STREAM.
// Client MAY retry (on a different connection).  See RFC7540 Section 8.1.4.
export const ERR_SPDY_SERVER_REFUSED_STREAM = -351;

// SPDY server didn't respond to the PING message.
export const ERR_SPDY_PING_FAILED = -352;

// Obsolete.  Kept here to avoid reuse, as the old error can still appear on
// histograms.
// export const ERR_PIPELINE_EVICTION = -353;

// The HTTP response body transferred fewer bytes than were advertised by the
// Content-Length header when the connection is closed.
export const ERR_CONTENT_LENGTH_MISMATCH = -354;

// The HTTP response body is transferred with Chunked-Encoding, but the
// terminating zero-length chunk was never sent when the connection is closed.
export const ERR_INCOMPLETE_CHUNKED_ENCODING = -355;

// There is a QUIC protocol error.
export const ERR_QUIC_PROTOCOL_ERROR = -356;

// The HTTP headers were truncated by an EOF.
export const ERR_RESPONSE_HEADERS_TRUNCATED = -357;

// The QUIC crytpo handshake failed.  This means that the server was unable
// to read any requests sent, so they may be resent.
export const ERR_QUIC_HANDSHAKE_FAILED = -358;

// Obsolete.  Kept here to avoid reuse, as the old error can still appear on
// histograms.
// export const ERR_REQUEST_FOR_SECURE_RESOURCE_OVER_INSECURE_QUIC = -359;

// Transport security is inadequate for the SPDY version.
export const ERR_SPDY_INADEQUATE_TRANSPORT_SECURITY = -360;

// The peer violated SPDY flow control.
export const ERR_SPDY_FLOW_CONTROL_ERROR = -361;

// The peer sent an improperly sized SPDY frame.
export const ERR_SPDY_FRAME_SIZE_ERROR = -362;

// Decoding or encoding of compressed SPDY headers failed.
export const ERR_SPDY_COMPRESSION_ERROR = -363;

// Proxy Auth Requested without a valid Client Socket Handle.
export const ERR_PROXY_AUTH_REQUESTED_WITH_NO_CONNECTION = -364;

// HTTP_1_1_REQUIRED error code received on HTTP/2 session.
export const ERR_HTTP_1_1_REQUIRED = -365;

// HTTP_1_1_REQUIRED error code received on HTTP/2 session to proxy.
export const ERR_PROXY_HTTP_1_1_REQUIRED = -366;

// The PAC script terminated fatally and must be reloaded.
export const ERR_PAC_SCRIPT_TERMINATED = -367;

// Obsolete. Kept here to avoid reuse.
// Request is throttled because of a Backoff header.
// See: crbug.com/486891.
// export const ERR_TEMPORARY_BACKOFF = -369;

// The server was expected to return an HTTP/1.x response, but did not. Rather
// than treat it as HTTP/0.9, this error is returned.
export const ERR_INVALID_HTTP_RESPONSE = -370;

// Initializing content decoding failed.
export const ERR_CONTENT_DECODING_INIT_FAILED = -371;

// Received HTTP/2 RST_STREAM frame with NO_ERROR error code.  This error should
// be handled internally by HTTP/2 code, and should not make it above the
// SpdyStream layer.
export const ERR_SPDY_RST_STREAM_NO_ERROR_RECEIVED = -372;

// The pushed stream claimed by the request is no longer available.
export const ERR_SPDY_PUSHED_STREAM_NOT_AVAILABLE = -373;

// A pushed stream was claimed and later reset by the server. When this happens,
// the request should be retried.
export const ERR_SPDY_CLAIMED_PUSHED_STREAM_RESET_BY_SERVER = -374;

// An HTTP transaction was retried too many times due for authentication or
// invalid certificates. This may be due to a bug in the net stack that would
// otherwise infinite loop, or if the server or proxy continually requests fresh
// credentials or presents a fresh invalid certificate.
export const ERR_TOO_MANY_RETRIES = -375;

// Received an HTTP/2 frame on a closed stream.
export const ERR_SPDY_STREAM_CLOSED = -376;

// Client is refusing an HTTP/2 stream.
export const ERR_SPDY_CLIENT_REFUSED_STREAM = -377;

// A pushed HTTP/2 stream was claimed by a request based on matching URL and
// request headers, but the pushed response headers do not match the request.
export const ERR_SPDY_PUSHED_RESPONSE_DOES_NOT_MATCH = -378;

// The cache does not have the requested entry.
export const ERR_CACHE_MISS = -400;

// Unable to read from the disk cache.
export const ERR_CACHE_READ_FAILURE = -401;

// Unable to write to the disk cache.
export const ERR_CACHE_WRITE_FAILURE = -402;

// The operation is not supported for this entry.
export const ERR_CACHE_OPERATION_NOT_SUPPORTED = -403;

// The disk cache is unable to open this entry.
export const ERR_CACHE_OPEN_FAILURE = -404;

// The disk cache is unable to create this entry.
export const ERR_CACHE_CREATE_FAILURE = -405;

// Multiple transactions are racing to create disk cache entries. This is an
// internal error returned from the HttpCache to the HttpCacheTransaction that
// tells the transaction to restart the entry-creation logic because the state
// of the cache has changed.
export const ERR_CACHE_RACE = -406;

// The cache was unable to read a checksum record on an entry. This can be
// returned from attempts to read from the cache. It is an internal error,
// returned by the SimpleCache backend, but not by any URLRequest methods
// or members.
export const ERR_CACHE_CHECKSUM_READ_FAILURE = -407;

// The cache found an entry with an invalid checksum. This can be returned from
// attempts to read from the cache. It is an internal error, returned by the
// SimpleCache backend, but not by any URLRequest methods or members.
export const ERR_CACHE_CHECKSUM_MISMATCH = -408;

// Internal error code for the HTTP cache. The cache lock timeout has fired.
export const ERR_CACHE_LOCK_TIMEOUT = -409;

// Received a challenge after the transaction has read some data, and the
// credentials aren't available.  There isn't a way to get them at that point.
export const ERR_CACHE_AUTH_FAILURE_AFTER_READ = -410;

// Internal not-quite error code for the HTTP cache. In-memory hints suggest
// that the cache entry would not have been useable with the transaction's
// current configuration (e.g. load flags, mode, etc.)
export const ERR_CACHE_ENTRY_NOT_SUITABLE = -411;

// The server's response was insecure (e.g. there was a cert error).
export const ERR_INSECURE_RESPONSE = -501;

// An attempt to import a client certificate failed, as the user's key
// database lacked a corresponding private key.
export const ERR_NO_PRIVATE_KEY_FOR_CERT = -502;

// An error adding a certificate to the OS certificate database.
export const ERR_ADD_USER_CERT_FAILED = -503;

// An error occurred while handling a signed exchange.
export const ERR_INVALID_SIGNED_EXCHANGE = -504;

// *** Code -600 is reserved (was FTP_PASV_COMMAND_FAILED). ***

// A generic error for failed FTP control connection command.
// If possible, please use or add a more specific error code.
export const ERR_FTP_FAILED = -601;

// The server cannot fulfill the request at this point. This is a temporary
// error.
// FTP response code 421.
export const ERR_FTP_SERVICE_UNAVAILABLE = -602;

// The server has aborted the transfer.
// FTP response code 426.
export const ERR_FTP_TRANSFER_ABORTED = -603;

// The file is busy, or some other temporary error condition on opening
// the file.
// FTP response code 450.
export const ERR_FTP_FILE_BUSY = -604;

// Server rejected our command because of syntax errors.
// FTP response codes 500, 501.
export const ERR_FTP_SYNTAX_ERROR = -605;

// Server does not support the command we issued.
// FTP response codes 502, 504.
export const ERR_FTP_COMMAND_NOT_SUPPORTED = -606;

// Server rejected our command because we didn't issue the commands in right
// order.
// FTP response code 503.
export const ERR_FTP_BAD_COMMAND_SEQUENCE = -607;

// PKCS #12 import failed due to incorrect password.
export const ERR_PKCS12_IMPORT_BAD_PASSWORD = -701;

// PKCS #12 import failed due to other error.
export const ERR_PKCS12_IMPORT_FAILED = -702;

// CA import failed - not a CA cert.
export const ERR_IMPORT_CA_CERT_NOT_CA = -703;

// Import failed - certificate already exists in database.
// Note it's a little weird this is an error but reimporting a PKCS12 is ok
// (no-op).  That's how Mozilla does it, though.
export const ERR_IMPORT_CERT_ALREADY_EXISTS = -704;

// CA import failed due to some other error.
export const ERR_IMPORT_CA_CERT_FAILED = -705;

// Server certificate import failed due to some internal error.
export const ERR_IMPORT_SERVER_CERT_FAILED = -706;

// PKCS #12 import failed due to invalid MAC.
export const ERR_PKCS12_IMPORT_INVALID_MAC = -707;

// PKCS #12 import failed due to invalid/corrupt file.
export const ERR_PKCS12_IMPORT_INVALID_FILE = -708;

// PKCS #12 import failed due to unsupported features.
export const ERR_PKCS12_IMPORT_UNSUPPORTED = -709;

// Key generation failed.
export const ERR_KEY_GENERATION_FAILED = -710;

// Error -711 was removed (ORIGIN_BOUND_CERT_GENERATION_FAILED)

// Failure to export private key.
export const ERR_PRIVATE_KEY_EXPORT_FAILED = -712;

// Self-signed certificate generation failed.
export const ERR_SELF_SIGNED_CERT_GENERATION_FAILED = -713;

// The certificate database changed in some way.
export const ERR_CERT_DATABASE_CHANGED = -714;

// Error -715 was removed (CHANNEL_ID_IMPORT_FAILED)

// DNS error codes.

// DNS resolver received a malformed response.
export const ERR_DNS_MALFORMED_RESPONSE = -800;

// DNS server requires TCP
export const ERR_DNS_SERVER_REQUIRES_TCP = -801;

// DNS server failed.  This error is returned for all of the following
// error conditions:
// 1 - Format error - The name server was unable to interpret the query.
// 2 - Server failure - The name server was unable to process this query
//     due to a problem with the name server.
// 4 - Not Implemented - The name server does not support the requested
//     kind of query.
// 5 - Refused - The name server refuses to perform the specified
//     operation for policy reasons.
export const ERR_DNS_SERVER_FAILED = -802;

// DNS transaction timed out.
export const ERR_DNS_TIMED_OUT = -803;

// The entry was not found in cache, for cache-only lookups.
export const ERR_DNS_CACHE_MISS = -804;

// Suffix search list rules prevent resolution of the given host name.
export const ERR_DNS_SEARCH_EMPTY = -805;

// Failed to sort addresses according to RFC3484.
export const ERR_DNS_SORT_ERROR = -806;

// Failed to resolve over HTTP, fallback to legacy
export const ERR_DNS_HTTP_FAILED = -807;
