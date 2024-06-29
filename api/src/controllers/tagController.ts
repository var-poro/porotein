import { Request, Response } from 'express';
import Tag from '../models/Tag';

interface AuthRequest extends Request {
    userId?: string;
}

export const createTag = async (req: AuthRequest, res: Response) => {
    try {
        const tag = new Tag(req.body);
        await tag.save();
        res.status(201).send(tag);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getTag = async (req: AuthRequest, res: Response) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).send();
        }
        res.send(tag);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
    try {
        const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tag) {
            return res.status(404).send();
        }
        res.send(tag);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).send();
        }
        res.send(tag);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllTags = async (req: AuthRequest, res: Response) => {
    try {
        const tags = await Tag.find();
        res.send(tags);
    } catch (error) {
        res.status(500).send(error);
    }
};