import express, { Request, Response } from "express";


// get all users
export const getAll = (req : Request, res : Response) => {
  const id = req.params.id;

  res.status(200).json({
    message: `All users fetched`,
  });
};

//  get all users by id
export const getById = (req : Request, res : Response) => {
  const id = req.params.id;
  res.status(200).json({
    message: `User ${id} fetched`,
  });
};

// create users
export const createUsers = (req : Request, res : Response) => {
  res.json({
    message: "User created",
  });
};

// Update users
export const updateUsers = (req : Request, res : Response) => {
  const id = req.params.id;
  res.json({
    message: `User ${id} updated`,
  });
}

// delete users 
export const deleteUsers =  (req :Request , res :Response) => {
    const id =req.params.id
  res.json({
    message: `User ${id} deleted`,
  });
}