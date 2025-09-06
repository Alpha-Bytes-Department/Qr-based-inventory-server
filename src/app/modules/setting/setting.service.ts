import { ISetting } from './setting.interface';
import { Setting } from './setting.model';

const createSetting = async (type: string, updateData: ISetting) => {
  try {
    const result = await Setting.findOneAndUpdate(
      { type },
      { $set: updateData },
      { upsert: true, new: true }
    );
    return result;
  } catch (error: any) {
    throw new Error(
      `Failed to update or create setting for type ${type}: ${error.message}`
    );
  }
};

const getSetting = async (type: string) => {
  try {
    const result = await Setting.findOne({ type });
    return result;
  } catch (error: any) {
    throw new Error(`Failed to get setting for type ${type}: ${error.message}`);
  }
};

export const SettingService = {
  createSetting,
  getSetting,
};
