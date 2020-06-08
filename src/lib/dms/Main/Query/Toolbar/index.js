import React, { Fragment } from "react";
import { Button, Icon, Dropdown, Menu, message } from "antd";
import { trim, get } from "lodash";
import { getSchema } from "../../../util";

const { SubMenu } = Menu;

export default props => {
    const { action, querySqlInfo, setQuerySqlInfo } = props;
    const { querySqlText } = querySqlInfo;

    const menu = (
        <Menu>
            <SubMenu
                title={
                    <Fragment>
                        <Icon type="star" />
				        选择
                    </Fragment>
                }
            >
                <Menu.Item>SQL语句1</Menu.Item>
                <Menu.Item>SQL语句2</Menu.Item>
            </SubMenu>
            <Menu.Item key="add">
                <Icon type="plus-square" />
				添加
			</Menu.Item>
            <Menu.Item key="manage">
                <Icon type="build" />
				管理
			 </Menu.Item>
        </Menu>
    );

    return (
        <div className="toolbar">
            <Button
                icon="rocket"
                onClick={() => {
                    if (!querySqlText || !(querySqlText && trim(querySqlText))) {
                        message.warning("请输入SQL语句");
                        return;
                    }

                    // 设置loading
                    setQuerySqlInfo({
                        ...querySqlInfo,
                        loading: true
                    })

                    action({
                        value: querySqlText
                    }).then((data) => {
                        if (data.error) {
                            setQuerySqlInfo({
                                loading: false,
                                querySqlText,
                                schema: [],
                                content: [],
                                resultTab: "message",
                                errorInfo: get(data, "error.original")
                            })
                        } else {
                            // 获取schema
                            const schema = getSchema(data);

                            setQuerySqlInfo({
                                querySqlText,
                                loading: false,
                                schema,
                                content: data,
                                resultTab: "result",
                                errorInfo: null
                            })
                        }
                    }).catch((res) => {
                        setQuerySqlInfo({
                            loading: false,
                            querySqlText,
                            schema: [],
                            content: [],
                            resultTab: "message",
                            errorInfo: null
                        })
                    });
                }}
            >
                运行
			</Button>
            <Button icon="interaction">
                格式化
			</Button>
            <Dropdown
                overlay={menu}
            >
                <Button>
                    我的SQL <Icon type="down" />
                </Button>
            </Dropdown>
        </div>
    );
}