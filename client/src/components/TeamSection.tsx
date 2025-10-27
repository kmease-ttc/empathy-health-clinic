import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import team1 from "@assets/generated_images/Team_member_headshot_1_2f59af5e.png";
import team2 from "@assets/generated_images/Team_member_headshot_2_6581239e.png";
import team3 from "@assets/generated_images/Team_member_headshot_3_9a01950e.png";
import team4 from "@assets/generated_images/Team_member_headshot_4_0db076a8.png";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Alex Regan",
      credentials: "Psychiatric PA-C",
      image: team1
    },
    {
      name: "Dr. Robert Glenn",
      credentials: "MD",
      image: team2
    },
    {
      name: "Marjorie Felix",
      credentials: "MSN, APRN, PMHNP-BC",
      image: team3
    },
    {
      name: "Christine Orr",
      credentials: "LCSW",
      image: team4
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-center mb-12 md:mb-16">
          Meet the Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center space-y-4"
              data-testid={`team-member-${index}`}
            >
              <Avatar className="w-full aspect-square rounded-lg mx-auto">
                <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                <AvatarFallback className="text-2xl rounded-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.credentials}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
