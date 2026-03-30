export interface JourneyEntry {
  id:          string;
  type:        'education' | 'experience';
  title:       string;
  org:         string;
  location:    string;
  period:      string;
  description: string;
  tags:        string[];
}
