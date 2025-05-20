import wisp from "wisp-server-node";

export async function onRequest(context, next) {
	const request = context.request;
	const upgradeHeader = request.headers.get("Upgrade");
	if (upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
		if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
		else socket.end();
	}
	return next();
}
