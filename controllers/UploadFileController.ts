import express from 'express';
import cloudinary from '../core/cloudinary';

class UploadFilerController {
	async upload(req: express.Request, res: express.Response): Promise<void> {
		const file = req.file;
		const path = '../' + file?.path;

		cloudinary.uploader
			.upload_stream({ resource_type: 'auto' }, (error, data) => {
				if (error || !data) {
					return res.status(500).json({
						status: 'error',
						message: error || 'upload error',
					});
				}
				res
					.json({
						url: data.url,
						height: data.height,
						size: Math.round(data.bytes / 1024),
						width: data.width,
					})
					.status(201);
			})
			.end(file?.buffer);
	}
}

export const UploadCtrl = new UploadFilerController();
