
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { StatusIndicator } from '@/components/ui-custom/StatusIndicator';
import { ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RiskHistoryRecord {
  id: number;
  value: number;
  currency: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

interface RiskHistoryData {
  [key: string]: RiskHistoryRecord[];
}

interface RiskHistoryTableProps {
  riskHistoryData: RiskHistoryData;
  selectedMto: string;
  mtoName: string | undefined;
  formatCurrency: (amount: number, currency: string) => string;
}

export function RiskHistoryTable({
  riskHistoryData,
  selectedMto,
  mtoName,
  formatCurrency
}: RiskHistoryTableProps) {
  const records = selectedMto ? riskHistoryData[selectedMto] || [] : [];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span>Risk Value History</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Historical record of risk value adjustments
          </p>
        </div>
        {mtoName && (
          <div className="text-right">
            <h4 className="text-sm font-medium">
              {mtoName}
            </h4>
            <p className="text-xs text-muted-foreground">
              {records.length} records
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk Value</TableHead>
              <TableHead>Validity Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {formatCurrency(record.value, record.currency)}
                </TableCell>
                <TableCell>
                  {format(record.startDate, 'PP')} - {record.endDate ? format(record.endDate, 'PP') : 'Present'}
                </TableCell>
                <TableCell>
                  <StatusIndicator 
                    status={record.isActive ? "positive" : "neutral"} 
                    label={record.isActive ? "Active" : "Expired"}
                  />
                </TableCell>
                <TableCell>
                  {record.createdBy}
                </TableCell>
                <TableCell className="text-right">
                  {format(record.createdAt, 'PP')}
                </TableCell>
              </TableRow>
            ))}
            
            {(!selectedMto || records.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No history records available for the selected MTO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
