import { challenge_response } from "../models/challenge_response.model";
import { dashboard_map_stat } from "../models/dashboard_map_stat.model";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import { team } from "../models/team.model";
import BaseService from "./base.service";

export default class DashboardService extends BaseService{

    async getMapStats(){
        let uniqueDistricts: any;
        let bulkCreateArray: any = [];
        uniqueDistricts = await this.crudService.findAll(organization, { group: ["district"] });
        for (const district of uniqueDistricts) {
            if (district.district === null) {
                continue
            }
            const overAllSchool = await this.crudService.findAll(organization, {
                where: { district: district.dataValues.district }
            });
            const schoolIdsInDistrict = overAllSchool.map((Element: any) => Element.dataValues.organization_code);
            const mentorReg = await this.crudService.findAll(mentor, {
                where: {
                    organization_code: schoolIdsInDistrict
                }
            });
            const mentorIdInDistrict = mentorReg.map((Element: any) => Element.dataValues.mentor_id);
            const schoolRegistered = await this.crudService.findAll(mentor, {
                where: {
                    mentor_id: mentorIdInDistrict,
                },
                group: ['organization_code']
            });
            const registeredSchoolIdsInDistrict = schoolRegistered.map((Element: any) => Element.dataValues.organization_code);
            const teamReg = await this.crudService.findAll(team, {
                where: { mentor_id: mentorIdInDistrict }
            });
            const teamIdInDistrict = teamReg.map((Element: any) => Element.dataValues.team_id);
            const challengeReg = await this.crudService.findAll(challenge_response, {
                where: { team_id: teamIdInDistrict }
            });
            const challengeInDistrict = challengeReg.map((Element: any) => Element.dataValues.challenge_response_id);
            bulkCreateArray.push({
                overall_schools: schoolIdsInDistrict.length,
                reg_schools: registeredSchoolIdsInDistrict.length,
                teams: teamIdInDistrict.length,
                ideas: challengeInDistrict.length,
                district_name: district.district
            })
        }
        await this.crudService.delete(dashboard_map_stat, { where: {}, truncate: true });
        const result = await this.crudService.bulkCreate(dashboard_map_stat, bulkCreateArray);
        // console.log(result)
        return result;
    }

}