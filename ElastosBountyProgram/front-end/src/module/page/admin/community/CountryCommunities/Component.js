import React from 'react'
import { Link } from 'react-router-dom'
import AdminPage from '../../BaseAdmin'
import { Button, Card, Select, Col, message, Row, Breadcrumb, Icon, List, Avatar } from 'antd'
import _ from 'lodash'
import ModalAddCountry from '../../shared/ModalAddCountry/Component'
import config from '@/config'
import Navigator from '../../shared/Navigator/Component'

import '../style.scss'

export default class extends AdminPage {
    state = {
        visibleModalAddCountry: false,
        communities: []
    }

    // Modal add country
    showModalAddCountry = () => {
        this.formRefAddCountry.props.form.setFieldsValue({
            geolocation: this.props.match.params['country'],
        }, () => {
            this.setState({
                visibleModalAddCountry: true,
            })
        })
    }
    handleCancelModalAddCountry = () => {
        const form = this.formRefAddCountry.props.form
        form.resetFields()

        this.setState({visibleModalAddCountry: false})
    }
    handleCreateCountry = () => {
        const form = this.formRefAddCountry.props.form

        form.validateFields((err, values) => {
            if (err) {
                return
            }

            form.resetFields()
            this.setState({visibleModalAddCountry: false})

            console.log('values', values);
            this.props.addCountry({
                geolocation: values.geolocation,
                leaderIds: config.data.mockDataLeaderId, // Just mock data, in future use may set it from values.leaderId
            }).then(() => {
                message.success('Add new country successfully')

                this.loadCommunities();
            }).catch((err) => {
                console.error(err);
                message.error('Error while add country')
            })
        })
    }
    saveFormAddCountryRef = (formRef) => {
        this.formRefAddCountry = formRef
    }

    componentDidMount() {
        this.loadCommunities();
    }

    loadCommunities() {
        const currentCountry = this.props.match.params['country'];
        if (currentCountry) {
            this.props.getSpecificCountryCommunities(currentCountry).then((communities) => {
                this.convertCommunitiesLeaderIdsToLeaderObjects(communities).then((communities) => {
                    this.setState({
                        communities
                    })
                })
            })
        } else {
            this.props.getAllCountryCommunity().then((communities) => {
                this.convertCommunitiesLeaderIdsToLeaderObjects(communities).then((communities) => {
                    this.setState({
                        communities
                    })
                })
            })
        }
    }
    
    mockAvatarToUsers(users) {
        users.forEach((user) => {
            user.profile.avatar = config.data.mockAvatarUrl
        })
        
        return users
    }
    
    // API only return list leader ids [leaderIds], so we need convert it to array object leader [leaders]
    convertCommunitiesLeaderIdsToLeaderObjects(communities) {
        return new Promise((resolve, reject) => {
            let userIds = []
            communities.forEach((community) => {
                userIds.push(...community.leaderIds)
            })
            userIds = _.uniq(userIds)
            
            if (!userIds.length) {
                return resolve([])
            }

            this.props.getUserByIds(userIds).then((users) => {
                users = this.mockAvatarToUsers(users) // Mock avatar url
                const mappingIdToUserList = _.keyBy(users, '_id');
                communities.forEach((community) => {
                    community.leaders = community.leaders || [];
                    community.leaderIds.forEach((leaderId) => {
                        if (mappingIdToUserList[leaderId]) {
                            community.leaders.push(mappingIdToUserList[leaderId])
                        }
                    })
                })

                return resolve(communities)
            })
        })
    }

    handleChangeCountry(geolocation) {
        if (geolocation) {
            this.props.getSpecificCountryCommunities(geolocation).then((communities) => {
                this.setState({
                    communities
                })

                this.props.history.push(`/admin/community/country/${geolocation}`)
            })
        } else {
            this.props.getAllCountryCommunity().then((communities) => {
                this.setState({
                    communities
                })

                this.props.history.push('/admin/community')
            })
        }
    }

    ord_renderContent () {
        const listCommunitiesEl = this.state.communities.map((community, index) => {
            return (
                <Col span={6} key={index} className="user-card">
                    <Link to={'/admin/community/' + community._id  + '/country/' + community.geolocation}>
                        <Card title={community.name}>
                            <List
                                dataSource={community.leaders}
                                renderItem={item => (
                                    <List.Item className="organizerListItem">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Avatar size="large" icon="user" src={item.profile.avatar}/>
                                                </td>
                                                <td>
                                                    {item.profile.firstName} {item.profile.lastName}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Link>
                </Col>
            )
        })

        // Here we only want to show communities
        // const listCountriesEl = this.state.communities.map((country, index) => {
        //     return (
        //         <Select.Option title={country.name} key={index}
        //                        value={country.geolocation}>{country.name}</Select.Option>
        //     )
        // })
    
        // Dropdown will have errors if two communities has same geolocation key
        // At the moment, I display all countries
        const listCountriesEl = Object.keys(config.data.mappingCountryCodeToName).map((key, index) => {
            return (
                <Select.Option title={config.data.mappingCountryCodeToName[key]} key={index}
                               value={key}>{config.data.mappingCountryCodeToName[key]}</Select.Option>
            )
        })

        const menuCountriesEl = (
            <Select
                allowClear
                value={this.props.match.params['country'] || undefined}
                showSearch
                style={{width: 160}}
                placeholder="Select a country"
                optionFilterProp="children"
                onChange={this.handleChangeCountry.bind(this)}
            >
                {listCountriesEl}
            </Select>
        )

        return (
            <div className="p_admin_index ebp-wrap c_adminCommunity">
                <div className="d_box">
                    <div className="p_admin_breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">
                                <Icon type="home"/>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to="/admin/community">Community</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {menuCountriesEl}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="p_admin_content">
                        <Row>
                            <Col span={20}
                                 className="admin-left-column wrap-box-user">
                                <div>
                                    <Button className="ant-btn-ebp pull-right" onClick={this.showModalAddCountry} type="primary">Add country</Button>
                                    <h2 className="without-padding">Country Organizers</h2>
                                    <Row>
                                        {listCommunitiesEl}
                                    </Row>

                                    <ModalAddCountry
                                        wrappedComponentRef={this.saveFormAddCountryRef}
                                        visible={this.state.visibleModalAddCountry}
                                        onCancel={this.handleCancelModalAddCountry}
                                        onCreate={this.handleCreateCountry}
                                    />
                                </div>
                            </Col>
                            <Col span={4}
                                 className="admin-right-column wrap-box-navigator">
                                <Navigator selectedItem={'community'}/>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
