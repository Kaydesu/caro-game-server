import { Router } from "express";
import RoomManager from "../../class/RoomManager";
import UserManager from "../../class/UserManager";
import { ERROR_CODES } from "../../utils/constants";
import { apiError } from "../../utils/functions";
import { ApiRequest, ApiResponse } from "../../utils/type";
import { LeftRoomBody, LeftRoomSuccess } from "./type";

const router = Router();

router.post('/:roomId', (
  req: ApiRequest<LeftRoomBody, { roomId: string }>,
  res: ApiResponse<LeftRoomSuccess>,
) => {
  const { userId } = req.body;
  const { roomId } = req.params;

  // Check user exist
  if (!UserManager.getById(userId)) {
    return res.status(400).json({
      status: 'error',
      error: apiError(ERROR_CODES.USER_NOT_EXIST),
    })
  }

  // Check room exist
  const room = RoomManager.getRoom(roomId)
  if (room) {
    if (!room.checkUserExist(userId)) {
      RoomManager.left(userId, roomId);
    }
  } else {
    return res.status(400).json({
      status: "error",
      error: apiError(ERROR_CODES.ROOM_NOT_EXIST),
    })
  }
})

export default router;