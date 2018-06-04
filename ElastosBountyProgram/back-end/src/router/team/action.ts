import Base from '../Base';
import TeamService from '../../service/TeamService';

export default class extends Base {
    protected needLogin = true;
    async action(){
        const param = this.getParam();
        const {action} = param;

        const teamService = this.buildService(TeamService);

        let rs = null;
        if(action === 'accept'){
            rs = await teamService.acceptApply(param);
        }
        else if(action === 'reject'){
            rs = await teamService.rejectApply(param);
        }
        else{
            return this.res.sendStatus(403);
        }

        return this.result(1, rs);
    }
}