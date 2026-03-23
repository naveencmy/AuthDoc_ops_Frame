import { SettingsRepository } from "../repositories/settings.repository.js"

export class SettingsService {
  static async listSettings() {
    return SettingsRepository.listSettings()
  }
  static async updateSetting(key, value) {
    return SettingsRepository.updateSetting(key, value)
  }
}