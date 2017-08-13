import * as React from 'react';
import Popover, { Position } from 'react-popover-typescript';
import { AutoSizer } from 'react-virtualized';

const TARGET_COLOR = 'rgba(20, 40, 80, 0.3)';
const TARGET_OPEN_COLOR = 'rgba(20, 40, 80, 0.6)';
const TOGGLE_BUTTON_COLOR = 'rgba(30, 50, 90, 0.3)';

const TARGET_SIZE = 150;
const TOGGLE_BUTTON_WIDTH = 60;
const NO_SELECT = {
    userSelect: 'none',
    MsUserSelect: 'none',
    MozUserSelect: 'none',
    KhtmlUserSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
};
const FONT = {
    color: 'white',
    fontFamily: 'sans-serif',
};

interface DemoState {
    targetX: number;
    targetY: number;
    isTargetActive: boolean;
    isToggleActive: boolean;
    targetClickOffsetX: number;
    targetClickOffsetY: number;
    isPopoverOpen: boolean;
    isMouseDown: boolean;
    positionIndex: number;
}

const SomeFunctionalComponent = () => (
    <div
        style={{
            backgroundColor: 'orange',
        }}
    >
        hey lololol
    </div>
);

class Demo extends React.Component<{}, DemoState> {
    constructor() {
        super();
        this.state = {
            targetX: null,
            targetY: null,
            isToggleActive: false,
            isTargetActive: false,
            targetClickOffsetX: 0,
            targetClickOffsetY: 0,
            isPopoverOpen: false,
            isMouseDown: false,
            positionIndex: 0,
        };
    }

    public render() {
        const { targetX, targetY, isTargetActive, isPopoverOpen, positionIndex, isToggleActive } = this.state;
        const positions: Position[] = ['top', 'right', 'bottom', 'left'];
        const currentPosition = positions[positionIndex % positions.length];
        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        style={{
                            position: 'relative',
                            width,
                            height,
                        }}
                        onMouseMove={this.onMouseMove}
                    // onClick={() => this.setState({ position: position === 'bottom' ? 'top' : 'bottom' })}
                    >
                        <Popover
                            isOpen={isPopoverOpen}
                            content={(
                                <div
                                    style={{
                                        padding: 15,
                                        backgroundColor: TARGET_OPEN_COLOR,
                                        opacity: 0.7,
                                        height: 200,
                                        ...FONT,
                                        ...NO_SELECT,
                                    }}
                                >
                                    DUDE I'M A POPOVER
                                </div>
                            )}
                            position={currentPosition}
                        >
                            <div
                                style={{
                                    width: TARGET_SIZE,
                                    height: TARGET_SIZE,
                                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
                                    opacity: isTargetActive ? 0.9 : 0.7,
                                    backgroundColor: isPopoverOpen
                                        ? TARGET_OPEN_COLOR
                                        : TARGET_COLOR,
                                    position: 'absolute',
                                    left: targetX !== null ? targetX : (width / 2) - (TARGET_SIZE / 2),
                                    top: targetY !== null ? targetY : (height / 2) - (TARGET_SIZE / 2),
                                }}
                                onMouseDown={this.onTargetMouseDown}
                                onMouseUp={this.onTargetMouseUp}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: TOGGLE_BUTTON_WIDTH,
                                        height: TOGGLE_BUTTON_WIDTH,
                                        bottom: 0,
                                        right: 0,
                                        opacity: isToggleActive ? 1 : 0.8,
                                        pointerEvents: 'none',
                                        color: 'white',
                                        fontFamily: 'sans-serif',
                                        backgroundColor: TOGGLE_BUTTON_COLOR,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
                                        ...FONT,
                                        ...NO_SELECT,
                                    }}
                                >
                                    {currentPosition}
                                </div>
                            </div>
                        </Popover>
                    </div>
                )}
            </AutoSizer>
        );
    }

    private onTargetMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop;
        const isTogglingPosition = targetClickOffsetX > TARGET_SIZE - TOGGLE_BUTTON_WIDTH && targetClickOffsetY > TARGET_SIZE - TOGGLE_BUTTON_WIDTH;
        this.setState({
            isTargetActive: !isTogglingPosition,
            isToggleActive: isTogglingPosition,
            isMouseDown: true,
            targetClickOffsetX,
            targetClickOffsetY,
        });
    }

    private onTargetMouseUp: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isPopoverOpen, isTargetActive, isToggleActive, positionIndex } = this.state;
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop;
        const isTogglingPosition = targetClickOffsetX > TARGET_SIZE - TOGGLE_BUTTON_WIDTH && targetClickOffsetY > TARGET_SIZE - TOGGLE_BUTTON_WIDTH;

        const shouldPopoverToggle = isTargetActive;
        const shouldTogglePosition = isToggleActive;

        this.setState({
            isTargetActive: false,
            isToggleActive: false,
            isMouseDown: false,
            isPopoverOpen: shouldPopoverToggle
                ? !isPopoverOpen
                : isPopoverOpen,
            positionIndex: shouldTogglePosition
                ? positionIndex + 1
                : positionIndex,
        });
    }

    private onMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isMouseDown, targetClickOffsetX, targetClickOffsetY } = this.state;
        if (isMouseDown) {
            this.setState({
                isTargetActive: false,
                isToggleActive: false,
                targetY: e.clientY - targetClickOffsetY,
                targetX: e.clientX - targetClickOffsetX,
            });
        }
    }
}

export { Demo };