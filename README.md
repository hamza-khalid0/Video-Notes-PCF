# Video-Notes-PCF

**Video-Notes-PCF** is a Power Apps Component Framework (PCF) control that enables users to attach, preview, and play short video or audio notes directly within model-driven forms in Microsoft Dynamics 365. This control enhances user engagement by allowing inline media playback from Dataverse Notes or SharePoint.

## Features

- Attach notes inline
- Supports playback of media stored in annotation
- Responsive and lightweight control
- Ideal for use cases like field reports, verbal memos, or visual inspections

## Requirements

- Node.js (LTS recommended)
- Power Platform CLI (`pac`)
- Visual Studio Build Tools (for `msbuild`)
- Power Apps environment with appropriate table (entity)

## Installation

```bash
git clone https://github.com/hamza-khalid0/Video-Notes-PCF.git
cd Video-Notes-PCF
npm install
npm run build
```

To test locally:

```bash
npm start
```

## Usage

1. Import the solution file into your Power Apps/Dynamics 365 environment.
2. Go to the form where you want to use the control.
3. Add the field bound to the control (e.g., a text or lookup field).
4. Under the control section, add "Video-Notes-PCF".
5. Enable it for Web/Tablet/Phone as needed.
6. Save and publish the form.

## Storage Options

- **Notes (Annotation)**: By default, you can use the Dataverse notes to store and retrieve attached video/audio files.
- **SharePoint**: If integrated, the control can reference files stored in the related SharePoint document library.

## License

MIT License. See [LICENSE](./LICENSE) for more details.

## Contributions

Feel free to fork, raise issues, or submit pull requests to improve this control.

---

Created by [Hamza Khalid](https://github.com/hamza-khalid0)
