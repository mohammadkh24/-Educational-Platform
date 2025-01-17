const ticketModel = require("../../models/ticket");
const departmentsModel = require("../../models/department");
const departmentsSubsModel = require("../../models/subDepartment");
// const { isValidObjectId } = require("mongoose");
const { Types, isValidObjectId, default: mongoose } = require("mongoose");

exports.create = async (req, res) => {
  const { departmentID, departmentSubID, priority, body, title } = req.body;

  const department = await departmentsModel.findOne({ _id: departmentID });

  if (!department) {
    return res.status(404).json({
      message: "Department not found !!",
    });
  }

  const subDepartment = await departmentsSubsModel.findOne({
    _id: departmentSubID,
  });

  if (!subDepartment) {
    return res.status(404).json({
      message: "SubDepartment not found !!",
    });
  }

  const createTicket = await ticketModel.create({
    departmentID: department,
    departmentSubID: subDepartment,
    priority,
    title,
    body,
    user: req.user._id,
    answer: 0,
    isAnswer: 0,
  });

  return res.status(201).json({
    message: "Ticket created successfully",
    createTicket,
  });
};

exports.getAll = async (req, res) => {
  const tickets = await ticketModel.find();

  return res.json(tickets);
};

exports.userTicket = async (req, res) => {
  const userTickets = await ticketModel.find({ user: req.user._id }).lean();

  if (!userTickets.length === 0) {
    return res.status(404).json({
      message: "No tickets found for this user.",
    });
  }

  return res.json(userTickets);
};

exports.departments = async (req, res) => {
  const departments = await departmentsModel.find().lean();

  return res.json(departments);
};

exports.departmentsSubs = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Department ID is not valid.",
    });
  }

  const departmentSubs = await departmentsSubsModel
    .find({ parentID: id })
    .lean();

  return res.json(departmentSubs);
};

exports.setAnswer = async (req, res) => {
  const { body, ticketID } = req.body;

  const ticket = await ticketModel.findOne({ _id: ticketID }).lean();

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found !!",
    });
  }

  const answer = await ticketModel.create({
    title: "پاسخ تیکت شما",
    ticketID,
    body,
    parent: ticketID,
    priority: ticket.priority,
    user: req.user._id,
    isAnswer: 1,
    answer: 0,
    departmentID: ticket.departmentID,
    departmentSubID: ticket.departmentSubID,
  });

  await ticketModel.findOneAndUpdate(
    { _id: ticket._id },
    {
      answer: 1,
    }
  );

  return res.status(201).json({
    message: "answer created successfull",
    answer,
  });
};

exports.getAnswer = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "AnswerID is not valid !!",
    });
  }

  const ticket = await ticketModel.findOne({ _id: id }).lean();

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found !!",
    });
  }

  const answers = await ticketModel.find({ ticketID: ticket._id }).lean();

  return res.json(answers);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "TicketID is not valid.",
    });
  }

  const removeTicket = await ticketModel.findOneAndDelete({ _id: id });

  return res.status(202).json({
    message: "Ticket deleted successfull",
    removeTicket,
  });
};
