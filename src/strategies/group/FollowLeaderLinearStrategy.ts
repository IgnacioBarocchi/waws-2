import { XYPosition } from "reactflow";
import AnimalGroup from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";

export default class FollowLeaderLinearStrategy {
  private group: AnimalGroup;

  constructor(group: AnimalGroup) {
    this.group = group;
  }

  getPositionsForMembers(): [Animal, XYPosition][] {
    const leader = this.group.accessLeader;
    const leaderPosition = leader.position;
    const followers = [
      ...this.group.accessSortedMembers.splice(
        1,
        this.group.accessSortedMembers.length - 1
      ),
    ];

    // from h to l
    return followers.map((follower: Animal, i: number, arr: Animal[]) => {
      if (i === 0) {
        return [follower, { x: leaderPosition.x - 100, y: leaderPosition.y }];
      }

      const previousFollowerPosition = followers[i - 1].position;

      return [
        follower,
        { x: previousFollowerPosition.x - 100, y: previousFollowerPosition.y },
      ];
    });
  }

  updatePosition(deltaTime: number): void {
    const leader = this.group.accessLeader;

    for (let i = 0; i < this.group.accessSortedMembers.length - 1; i++) {
      const follower = this.group.accessSortedMembers[i];
      const targetUnit = this.group.accessSortedMembers[i + 1];

      if (follower instanceof Animal && targetUnit) {
        console.log(follower.id + "the follower");
        follower.motorSystem.follow(targetUnit, deltaTime);
      }
    }

    if (this.group.accessSortedMembers.length > 0 && leader instanceof Animal) {
      const lastMember =
        this.group.accessSortedMembers[
          this.group.accessSortedMembers.length - 1
        ];

      console.log(lastMember.id + "the follower > " + lastMember.id);

      lastMember.motorSystem.follow(leader, deltaTime);
    }
  }
}
