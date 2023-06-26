const handler: ApiHandler = async (req, res, next) => {
  switch (req.method) {
    case "GET":
      await GET(req, res, next);
      break;
    case "POST":
      await POST(req, res, next);
      break;
    case "PUT":
      await PUT(req, res, next);
      break;
    case "DELETE":
      await DELETE(req, res, next);
      break;
  }
};

const GET: ApiHandler = async (req, res, next) => {
  res.status(200).end();
};

const POST: ApiHandler = async (req, res, next) => {
  res.status(200).end();
};

const PUT: ApiHandler = async (req, res, next) => {
  res.status(200).end();
};

const DELETE: ApiHandler = async (req, res, next) => {
  res.status(200).end();
};

export default handler;
