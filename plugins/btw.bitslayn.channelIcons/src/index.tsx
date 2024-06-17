import { ComponentType, SetStateAction, useState } from "react";
import { Injector, components, util, webpack } from "replugged";
import { modal } from "replugged/common";
import "./styles.css";
import { Store } from "replugged/dist/renderer/modules/common/flux";
import { AnyFunction, ContextMenuTypes } from "replugged/types";
import {
  EditedChannelIcon,
  SelectedChannelStore,
  capitalizeWords,
  // generateInterface,
  getChannelObject,
  getCurrentChannelObject,
  injectChannelPillStyle,
  injectChannelStyle,
  injectNamedChannelStyles,
  randomNumber,
  selectedIcon,
} from "./helpers";
import { Icons, config, group1Array } from "./icons";
import { ChannelNames } from "./specialSVGs";
import { TabBar } from "./TabBar";
// import CustomTooltip from "./Tooltip";
import ChannelExample from "./ChannelExample";
import {
  BrandColors,
  ChannelStoreChannel,
  ColoredChannel,
  ModalsModule,
  int2hexModule,
} from "./types";
import { Divider } from "replugged/components";

const colorBrands: BrandColors = webpack.getByProps("colorBrand");
const ColorPicker: { CustomColorPicker: any } = webpack.getByProps("CustomColorPicker");
const inject: Injector = new Injector();
const {
  ContextMenu: { MenuItem },
} = components;
const { openModal } = modal;
const Modals: ModalsModule = webpack.getByProps("ConfirmModal");
export const { int2hex }: int2hexModule = webpack.getByProps("int2hex");
const { FormSwitch }: any = webpack.getByProps("FormSwitch");
const ChannelClass: { default: any } = webpack.getByProps("ChannelItemIcon");
export const ChannelStore: { getChannel: AnyFunction } & Store =
  webpack.getByStoreName("ChannelStore");
export const iconBuffer = "M 0,0 V 0 "; // Strict Icon Changes
const Header: { default: { Icon: any; Title: any } } =
  await webpack.getBySource("toolbar:function()");
/*const ChannelMention = webpack.getBySource(
  /let\{className:.*,message:.*,children:.*,content:.*,onUpdate:.*,contentRef:.*}=e/
);*/

/*const ChannelAutocomplete = webpack.getBySource("AutocompleteRowContent");
console.log(ChannelAutocomplete);*/

export const specialCases: { [key: string]: string } = {
  css: "CSS",
  js: "JS",
  html: "HTML",
  xml: "XML",
  json: "JSON",
  sql: "SQL",
  php: "PHP",

  faq: "FAQ",
  qotd: "QOTD",
};
export const lowercaseExceptions: Set<string> = new Set([
  "a",
  "ad",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "is",
  "nor",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "up",
  "yet",
]);

function injectSavedChannelsStyles(): void {
  const coloredChannels: any = config.get("coloredChannels", []);
  Object.entries(coloredChannels).forEach(
    ([channelId, { color, icon }]: [string, { color: string; icon: string }]) => {
      injectChannelStyle(channelId, color, icon);
    }
  );
}

function openEditor(data: any): void {
  selectedIcon("#000000", `${iconBuffer}${getChannelObject(data.channel.id)?.icon}`);
  const RenderThis: React.FC<any> = props => {
    const { channel } = data;
    const [channelColor, setChannelColor] = useState<string>(
      getChannelObject(channel.id)?.color ?? ""
    );
    const [channelIcon, setChannelIcon] = useState<string>(getChannelObject(channel.id)?.icon);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([
      channelColor || "#000000",
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#e91e63",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#95a5a6",
      "#607d8b",
    ]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredClassicIcons = Icons.filter(icon =>
      icon.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredModernIcons = group1Array.filter(icon =>
      icon.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const icons = [
      {
        id: 1,
        label: "Legacy Icons",
        element: () => (
          <div className="channelEditorIcons">
            {filteredClassicIcons.map((label: any) => (
              <components.Clickable
                onClick={() => {
                  setChannelIcon(label.value);
                  injectChannelStyle(channel.id, int2hex(channelColor), label.value);
                  selectedIcon(int2hex(channelColor), `${iconBuffer}${label.value}`);
                }}>
                <components.Tooltip text={label.label} spacing={24}>
                  <svg
                    className={label.label}
                    viewBox="-4 -4 32 32"
                    style={{ width: "32px", height: "32px" }}>
                    <path
                      fill={int2hex(channelColor) ?? "--channel-icon"}
                      d={`${iconBuffer}${label.value}`}
                      fillRule="evenodd"
                    />
                  </svg>
                </components.Tooltip>
              </components.Clickable>
            ))}
          </div>
        ),
      },
      {
        id: 2,
        label: "Modern Icons",
        element: () => (
          <div className="channelEditorIcons">
            {filteredModernIcons.map((label: any, index: number) => {
              const paths = Array.isArray(label.Matches)
                ? label.Matches.map((item: any) => item[1])
                : [label.Matches];

              return (
                <components.Clickable
                  key={index}
                  onClick={() => {
                    let fullPathString = "";
                    paths.forEach(x => {
                      fullPathString += x;
                    });
                    setChannelIcon(fullPathString);
                    injectChannelStyle(channel.id, int2hex(channelColor), fullPathString);
                    selectedIcon(int2hex(channelColor), fullPathString);
                  }}>
                  <components.Tooltip text={label.Name} spacing={24}>
                    <svg
                      key={index}
                      className={label.Name}
                      viewBox="-4 -4 32 32"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}>
                      {paths.map((pathData: any, innerIndex: number) => {
                        if (pathData && pathData.length > 0) {
                          return (
                            <path
                              key={innerIndex}
                              fill={int2hex(channelColor) ?? "--channel-icon"}
                              fillRule="evenodd"
                              d={`${iconBuffer}${pathData}`}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </svg>
                  </components.Tooltip>
                </components.Clickable>
              );
            })}
          </div>
        ),
      },
    ];

    const handleColorChange = (selectedColor: SetStateAction<string>): void => {
      const convertedColor: string = int2hex(selectedColor);
      setChannelColor(selectedColor);
      injectChannelStyle(channel.id, convertedColor, channelIcon);
      selectedIcon(convertedColor, `${iconBuffer}${channelIcon}`);
      const updatedColors: string[] = [
        convertedColor,
        ...suggestedColors.filter(color => color !== convertedColor),
      ].slice(0, 11);
      while (updatedColors.length < 11) {
        updatedColors.splice(1, 0, convertedColor);
      }
      setSuggestedColors(updatedColors);
      config.set("suggestedColors", updatedColors);
      config.set("coloredChannels", {
        ...config.get("coloredChannels", []),
        [channel.id]: { color: convertedColor, icon: channelIcon },
      });
    };

    return (
      <Modals.ConfirmModal
        confirmButtonColor={components.Button.Colors.BRAND}
        cancelButtonColor={colorBrands.colorDanger}
        confirmText={"Okay"}
        cancelText={"Remove"}
        onCancel={() => {
          const existingStyle = document.querySelector(`[data-channel-style="${channel.id}"]`);
          if (existingStyle) {
            existingStyle.remove();
            delete config.get("coloredChannels")[channel.id]; // this was that fix
          }
        }}
        header={`Personalize #${channel.name}`}
        className="channelEditor"
        {...props}>
        <div // Content
          className="channelEditorContent"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "422px",
            maxHeight: "330px",
          }}>
          <components.FormItem style={{ display: "flex", flexDirection: "column" }}>
            <components.TextInput
              style={{ height: "34px" }}
              placeholder="Search Icons"
              value={searchQuery}
              onChange={e => setSearchQuery(e)}
              {...util}
            />
            <div
              style={{
                position: "fixed",
                width: "34px",
                height: "34px",
                color: "var(--interactive-normal)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
                pointerEvents: "none",
              }}>
              <svg
                aria-hidden="false"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </components.FormItem>
          <div className="channelEditorSelector">
            <TabBar tabs={icons} />
          </div>
        </div>

        <div // Sidebar
          className="channelEditorSidebar"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflow: "hidden",
            maxHeight: "362px",
            width: "252px",
          }}>
          <ColorPicker.CustomColorPicker
            type={1}
            className="channelEditorColorPicker"
            value={channelColor}
            onChange={handleColorChange}
            suggestedColors={suggestedColors}
          />
        </div>

        <ChannelExample id={channel.id} name={channel.name}></ChannelExample>
      </Modals.ConfirmModal>
    );
  };

  openModal((x: any) => <RenderThis {...x} />);
}
const changedChannelNames: any[] = [];

function isChannelIdExists(channelId: string): boolean {
  return changedChannelNames.some((entry: any) => entry.channelid === channelId);
}

function injectNamedChannelsStyles() {
  if (config.get("presetChannelIcons", true)) {
    ChannelNames.forEach(channel => {
      if (channel.query !== "none") {
        channel.name.forEach(x =>
          injectNamedChannelStyles(x, Icons.find(i => i.label === channel.query).value)
        );
      }
    });
  } else {
    ChannelNames.forEach(channel =>
      channel.name.forEach(x => {
        if (document.querySelector(`[data-channel-named-style="${x}"]`)) {
          document.querySelector(`[data-channel-named-style="${x}"]`).remove();
        }
      })
    );
  }
}

export function start(): void {
  inject.uninjectAll();
  // console.log(generateInterface());
  injectSavedChannelsStyles();
  injectNamedChannelsStyles();
  injectChannelPillStyle();
  // eslint-disable-next-line no-undefined
  if (Header !== undefined) {
    inject.after(Header.default, "Title", (a: any) => {
      const headerObj = a?.[0]?.children?.props?.children;
      if (headerObj && getCurrentChannelObject()?.color) {
        const ChannelObject = getCurrentChannelObject();
        headerObj[2] = <span style={{ color: ChannelObject.color }}>{headerObj[2]}</span>;
        // clearChildrenAddPath(ChannelObject.icon)
      }
    });

    inject.before(Header.default, "Icon", (a: any) => {
      const ChannelObject = getCurrentChannelObject();
      const CurrentChannel: ChannelStoreChannel = ChannelStore.getChannel(
        SelectedChannelStore?.getCurrentlySelectedChannelId()
      ) as ChannelStoreChannel;
      const CustomIcon = ChannelNames?.slice()
        .reverse()
        .find(x => x.name.some(agony => CurrentChannel?.name?.toLowerCase().includes(agony))); // CSS is rather silly with multiple styles
      //console.log(CurrentChannel?.name);
      //console.log(CustomIcon);
      //console.log(CustomIcon && CustomIcon.query !== "none" && config.get("presetChannelIcons", true));
      if (a && a[0] && ChannelObject?.icon) {
        a[0].icon = () => {
          return <EditedChannelIcon channel={getCurrentChannelObject()} />;
        };
      } else if (
        CustomIcon &&
        CustomIcon.icon !== "none" &&
        config.get("presetChannelIcons", true)
      ) {
        a[0].icon = () => {
          return <CustomIcon.icon />;
        };
      } else if (
        CustomIcon &&
        CustomIcon.query !== "none" &&
        config.get("presetChannelIcons", true)
      ) {
        a[0].icon = () => {
          return (
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <g fill={getCurrentChannelObject()?.color ?? "var(--channel-icon)"}>
                <path
                  d={`${iconBuffer}${Icons.find(i => i.label === CustomIcon.query).value}`}
                  fillRule="evenodd"
                />
              </g>
            </svg>
          );
        };
      }
    });
  }

  // eslint-disable-next-line no-undefined
  if (ContextMenuTypes.ChannelContext !== undefined) {
    // eslint-disable-next-line consistent-return
    inject.utils.addMenuItem(ContextMenuTypes.ChannelContext, (data: any) => {
      const { channel } = data;
      // the code below gives a random modern icon uwu ;3 rawr x3 *waggles tail*
      const Object = group1Array[randomNumber(group1Array.length)];
      let RandomIcon: ComponentType<any>;
      // shut up.
      // eslint-disable-next-line no-undefined
      if (Object.Name !== undefined) {
        RandomIcon = webpack.getByProps(Object.Name)?.[Object?.Name];
      }
      // the code above gives a random modern icon uwu ;3 rawr x3 *waggles tail*
      if (channel.type !== 4) {
        return (
          <MenuItem
            id={`customize-channel-${channel.id}`}
            label="Personalize Channel"
            /* the code below gives discord an icon to display */
            icon={RandomIcon}
            /* the code above gives discord an icon to display */
            action={() => openEditor(data)}
          />
        );
      }
    });
  }

  // eslint-disable-next-line no-undefined
  if (ChannelClass !== undefined) {
    inject.after(ChannelClass, "default", (a: any) => {
      const channelInstance: any = a?.[0];
      if (channelInstance && config.get("changeChannelNames", true)) {
        const channel: any = ChannelStore.getChannel(channelInstance.channel.id);
        const oldName: string = channel.name;
        if (!isChannelIdExists(channel.id)) {
          channel.name = capitalizeWords(oldName, specialCases, lowercaseExceptions);
          changedChannelNames.push({ channelid: channel.id, oldName });
        }
      }
      if (!config.get("changeChannelNames", true)) {
        changedChannelNames.forEach(
          ({ channelid, oldName }: { channelid: string; oldName: string }) => {
            const channel: any = ChannelStore.getChannel(channelid);
            if (channel) {
              channel.name = oldName;
              // changedChannelNames.length -= 1;
            }
          }
        );
      }
    });
  }
}

export function getChangedChannelNames(): any[] {
  return changedChannelNames;
}

export function stop(): void {
  inject.uninjectAll();
  if (config.get("coloredChannels")) {
    const Channels = Object.keys(config.get("coloredChannels"));
    Channels.forEach((channelId: string) => {
      document.querySelector(`[data-channel-style="${channelId}"]`).remove();
    });
  }
  ChannelNames.forEach(channel =>
    channel.name.forEach(x => {
      if (document.querySelector(`[data-channel-named-style="${x}"]`)) {
        document.querySelector(`[data-channel-named-style="${x}"]`).remove();
      }
    })
  );
}

export function Settings(): JSX.Element {
  const [coloredChannels, setColoredChannels] = useState<any>(config.get("coloredChannels", []));
  const presetChannelIcons: { value; onChange } = util.useSetting(
    config,
    "presetChannelIcons",
    true
  );
  const coloredChannelPills: { value; onChange } = util.useSetting(
    config,
    "coloredChannelPills",
    true
  );
  //const advancedChannelNames: WordConfig = config.get("advancedChannelNames", []);

  const removeColoredChannel = (channelId: string): void => {
    const updatedChannels: any = { ...coloredChannels };
    delete updatedChannels[channelId];
    setColoredChannels(updatedChannels);
    config.set("coloredChannels", updatedChannels);
    document.querySelector(`[data-channel-style="${channelId}"]`).remove();
  };

  return (
    <div>
      <FormSwitch
        value={presetChannelIcons.value}
        onChange={value => {
          presetChannelIcons.onChange(value);
          injectNamedChannelsStyles();
        }}
        note={"Apply icons to channels automatically based on their name."}>
        Recommended Icons
      </FormSwitch>
      <FormSwitch
        {...util.useSetting(config, "changeChannelNames", true)}
        note={
          "Title every channel name in Pascal Case for a polished appearance. " +
          "𝗪𝗔𝗥𝗡𝗜𝗡𝗚 Sometimes caching will NOT work right. Refreshing always works."
        }>
        Pascal Case
      </FormSwitch>
      <FormSwitch
        value={coloredChannelPills.value}
        onChange={value => {
          coloredChannelPills.onChange(value);
          injectChannelPillStyle();
        }}
        note={"Changes the color used for channel mention and new thread pills to red and blue."}>
        Color Unread Indicators
      </FormSwitch>
      <components.Category
        title="Personalized Channels"
        note="View and modify your channel styles.">
        <div>
          {Object.entries(coloredChannels).map(([channelId]: [string, ColoredChannel]) => (
            <div style={{ marginBottom: "20px" }}>
              <div
                key={channelId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  justifyContent: "space-between",
                }}>
                <ChannelExample id={channelId} name={channelId}></ChannelExample>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      background: "transparent",
                      color: "var(--white-500)",
                      borderRadius: "5px",
                      padding: "4px 16px",
                    }}
                    onClick={() => openEditor({ channel: ChannelStore.getChannel(channelId) })}>
                    Edit
                  </button>
                  <button
                    style={{
                      background: "var(--button-outline-danger-border)",
                      color: "var(--button-outline-danger-text)",
                      borderRadius: "5px",
                      padding: "4px 10px",
                    }}
                    onClick={() => removeColoredChannel(channelId)}>
                    Remove
                  </button>
                </div>
              </div>
              <Divider style={{ marginTop: "20px" }}></Divider>
            </div>
          ))}
        </div>
      </components.Category>
    </div>
  );
}
